// Enable HTTP request client
var request = require('request');
// Enable jQuery
var cheerio = require('cheerio');
// Enable unix shell commands
var shell = require('shelljs');
// Enable Raspicam
var RaspiCam = require("raspicam");


// Web url for getting the videos
var webUrl = "http://depts.washington.edu/uwtclute/Images/";

// ssh url

var sshUrl = "uwtclute@ovid.u.washington.edu";

// Scp url for sending the videos
var scpUrl = sshUrl + ":/nfs/bronfs/uwfs/hw00/d95/uwtclute/Images";

// video path for deleting videos
var videosPath = "public_html/Images/";



// Default settings
var settings = {
    intervalMinutes: 0,
    intervalSeconds: 5,
    durationHours: 0,
    durationMinutes: 1,
    durationSeconds: 0,
    outputName: undefined,
    fps: 10,
    lock: 0
}

// Get only attributes containing '-'
function folderLinks($) {
    return $('a:contains(-)').get().map(function (a) {
        return a.attribs.href;
    });
}

// Get only attributes containing '.'
function fileLinks($) {
    return $('a:contains(.)').get().map(function (a) {
        return a.attribs.href;
    });
}

// Get all existing files from each existing folder on web url
exports.getAllFiles = function (req, res) {
    request(webUrl, function (error, response, body) {
    	if (error) {
	        res.json(error, 500);
    		console.log('Error due to changes in privacy policy by UW IT: ' + error);    		
    	} else {
	        var files = fileLinks(cheerio.load(body));
	        res.json({
	            files: files
	        }, 200);
	        console.log('GET ALL FILES - ' + JSON.stringify(files));
    	}
    });
}

// Get camera settings
exports.getCamera = function (req, res) {
    res.json({
        settings: settings
    }, 200);
    console.log('GET CAMERA - ' + JSON.stringify(settings));
}

// Start camera
exports.startCamera = function (req, res) {
	if (settings.lock > new Date()) {
		console.log('Lock is set at ' + JSON.stringify(settings.lock));
		res.json(settings, 404);
	} else {

	    settings = req.body;
        var timelapse = (settings.intervalMinutes * 60000) + (settings.intervalSeconds * 1000);
        var timeout = (settings.durationHours * 3600000) + (settings.durationMinutes * 60000) + (settings.durationSeconds * 1000);
        settings.lock = new Date();
        settings.lock = new Date(settings.lock.getTime() + (timeout) + (1 * 60 * 1000));

        res.json(settings, 200);

        // camera.start();
	    console.log('START CAMERA - ' + JSON.stringify(settings));

	    shell.exec("raspistill -o image%04d.jpeg -tl" + " " + timelapse + " " + "-t" + " " + timeout + " -w 1280 -h 720", function (code, output) {
	        console.log('raspistill reached. output: ' + output + ' code: ' + code);
            var converter = "gst-launch-1.0 multifilesrc location=image%04d.jpeg index=1 caps=image/jpeg,framerate=" + settings.fps + "/1 ! jpegdec ! omxh264enc ! avimux ! filesink location=" + settings.outputName + ".avi && rm *jpeg"
	        shell.exec(converter, function (code, output) {
	            console.log('gst-launch reached. output: ' + output + ' code: ' + code);
	            var scp = "scp " + settings.outputName + ".avi " + scpUrl + " && rm " + settings.outputName + ".avi";
	            console.log("this is scp " + scp);
	            shell.exec(scp, function (code, output) {
	                console.log('scp reached. output: ' + output + ' code: ' + code);
                    res.render('index');
	            });
	        });
	    });

	}
}

// Stop camera
exports.stopCamera = function (req, res) {
	settings.lock = undefined;
    res.json(settings, 200);
    // camera.stop();
    console.log('STOP CAMERA - ' + JSON.stringify(settings));
}


// Delete file
exports.deleteFile = function (req, res) {
    var deleteUrl = 'ssh ' + sshUrl + ' rm ' + videosPath + req.params.fileName;
    shell.exec(deleteUrl, function (code, output) {
        console.log('delete file reached. output: ' + output + ' code: ' + code);
        res.json(req.params.fileName, 200);
    });
};