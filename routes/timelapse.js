// Enable HTTP request client
var request = require('request');
// Enable jQuery
var cheerio = require('cheerio');
// Enable unix shell commands
var shell = require('shelljs');
// Enable Raspicam
var RaspiCam = require("raspicam");


// Default settings
var settings = {
    intervalMinutes: 0,
    intervalSeconds: 5,
    durationHours: 0,
    durationMinutes: 1,
    durationSeconds: 0,
    fps: 10
}

// Base url for file output
var baseUrl = 'http://students.washington.edu/jmzhwng/Images/';

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

// Get all existing files from each existing folder on base url
exports.getAllFiles = function (req, res) {
    request(baseUrl, function (error, response, body) {
        var files = fileLinks(cheerio.load(body));
        res.json({
            files: files
        }, 200);
        console.log('GET ALL FILES - ' + JSON.stringify(files));
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
    settings = req.body;
    var date = new Date();
    var outputName = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + "-" + date.getHours() + "hr" + date.getMinutes() + "min";

    var options = {
        mode: "timelapse",
        output: "image%04d",
        encoding: "jpg",
        timelapse: (settings.intervalMinutes * 60000) + (settings.intervalSeconds * 1000),
        timeout: (settings.durationHours * 3600000) + (settings.durationMinutes * 60000) + (settings.durationSeconds * 1000),
        width: 1280,
        height: 720
    }

    camera = new RaspiCam(options);

    camera.on("start", function( err, timestamp ){
      console.log("timelapse started at " + timestamp);
    });

    camera.on("read", function( err, timestamp, filename ){
      console.log("timelapse image captured with filename: " + filename);
    });

    camera.on("exit", function( timestamp ){
        shell.exec("gst-launch-1.0 multifilesrc location=image%04d.jpg index=1 caps=image/jpg,framerate=" + settings.fps + "/1 ! jpegdec ! omxh264enc ! avimux ! filesink location=" + outputName + ".avi && rm *jpg", function (code, output) {
            console.log('gst-launch reached. output: ' + output + ' code: ' + code);
            var scp = "scp " + outputName + ".avi jmzhwng@vergil.u.washington.edu:/nfs/bronfs/uwfs/dw00/d96/jmzhwng/Images && rm " + outputName + ".avi";
            console.log("this is scp " + scp);
            shell.exec(scp, function (code, output) {
                console.log('scp reached. output: ' + output + ' code: ' + code);
                res.json(settings, 200);
            });
        });
    });

    camera.on("stop", function( err, timestamp ){
      console.log("timelapse child process has been stopped at " + timestamp);
    });

    camera.start();

    // settings = req.body;

    // var date = new Date();
    // var outputName = (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear() + "-" + date.getHours() + "hr" + date.getMinutes() + "min";

    // var timelapse = (settings.intervalMinutes * 60000) + (settings.intervalSeconds * 1000);
    // var timeout = (settings.durationHours * 3600000) + (settings.durationMinutes * 60000) + (settings.durationSeconds * 1000);

    // shell.exec("raspistill -o image%04d.jpeg -tl" + " " + timelapse + " " + "-t" + " " + timeout + " -w 1280 -h 720", function (code, output) {
    //     console.log('raspistill reached. output: ' + output + ' code: ' + code);
    //     shell.exec("gst-launch-1.0 multifilesrc location=image%04d.jpeg index=1 caps=image/jpeg,framerate=" + settings.fps + "/1 ! jpegdec ! omxh264enc ! avimux ! filesink location=" + outputName + ".avi && rm *jpeg", function (code, output) {
    //         console.log('gst-launch reached. output: ' + output + ' code: ' + code);
    //         var scp = "scp " + outputName + ".avi jmzhwng@vergil.u.washington.edu:/nfs/bronfs/uwfs/dw00/d96/jmzhwng/Images && rm " + outputName + ".avi";
    //         console.log("this is scp " + scp);
    //         shell.exec(scp, function (code, output) {
    //             console.log('scp reached. output: ' + output + ' code: ' + code);
    //             res.json(settings, 200);
    //         });
    //     });
    // });

    // console.log('START CAMERA - ' + JSON.stringify(settings));
}

// Stop camera
exports.stopCamera = function (req, res) {
    camera.stop();
    res.json(settings, 200);
    console.log('STOP CAMERA - ' + JSON.stringify(settings));
}


// Delete file
exports.deleteFile = function (req, res) {
    var deleteUrl = 'ssh jmzhwng@vergil.u.washington.edu rm student_html/Images/' + req.params.fileName;
    shell.exec(deleteUrl, function (code, output) {
        console.log('delete file reached. output: ' + output + ' code: ' + code);
        res.json(req.params.fileName, 200);
    });
};