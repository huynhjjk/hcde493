var Q = require('q');
var request = require('request');
var cheerio = require('cheerio');
var shell = require('shelljs');
var fs = require('fs');
var RaspiCam = require("raspicam");
var camera;

var shellCommand = {
	text: "raspistill" + " " + "-t" + " " + 3000 + " " + "-tl" + " " + 1000 + " " + "-o" + " " + "public/images/image%d.jpg"
}

var settings = {
	intervalMinutes: 0,
	intervalSeconds: 5,
	durationHours: 0,
	durationMinutes: 1,
	durationSeconds: 0,
	fps: 10
}

exports.getFolders = function(req, res) {
	var folders = [];
	foldersUrl = 'http://students.washington.edu/jmzhwng/Images/';
	request(foldersUrl, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			$("a:contains('-')").filter(function(){
		        var data = $(this)[0].attribs.href;
				folders.push(data);	
	        })
		}
		res.json({
			folders: folders
		}, 200);
		console.log('GET FOLDERS - ' + JSON.stringify(folders));
	})

// 	var path = process.cwd() + '/public/images';
// 	fs.readdir(path, function (err, folders) {
// 	  if (err) {
// 	    console.log(err);
// 	    return;
// 	  }
// 		res.json({
// 			folders: folders
// 		}, 200);
// 		console.log('GET FOLDERS - ' + JSON.stringify(folders));
// 	});

}

exports.getImages = function(req, res) {
	var files = [];
	imagesUrl = 'http://students.washington.edu/jmzhwng/Images/' + req.params.folderName;
	request(imagesUrl, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);
			$("a:contains('.')").filter(function(){
		        var data = $(this)[0].attribs.href;
				files.push(data);
	        })
		}
		res.json({
		images: files
		}, 200);
		console.log('GET IMAGES - ' + JSON.stringify(files));
	})

 //  var path = process.cwd() + '/public/images/' + req.params.folderName;
	// fs.readdir(path, function (err, files) {
	//   if (err) {
	//     console.log(err);
	//     return;
	//   }
	// 	res.json({
	// 	images: files
	// 	}, 200);
	// 	console.log('GET IMAGES - ' + JSON.stringify(files));
	// });
}

exports.getAllImages = function(req, res) {
	// var folders = [];
	// var files = [];
	// foldersUrl = 'http://students.washington.edu/jmzhwng/Images/';
	// request(foldersUrl, function(error, response, html){
	// 	if(!error){
	// 		var $ = cheerio.load(html);
	// 		$("a:contains('-')").filter(function(){
	// 	        var data = $(this)[0].attribs.href;
	// 			folders.push(data);	
	//         })
	// 		for (var i=0; i < folders.length; i++) {
	// 			imagesUrl = 'http://students.washington.edu/jmzhwng/Images/' + folders[i];
	// 			request(imagesUrl, function(error, response, html){
	// 				if(!error){
	// 					var $ = cheerio.load(html);
	// 					$("a:contains('.')").filter(function(){
	// 				        var data = $(this)[0].attribs.href;
	// 						files.push(data);
	// 						console.log(files);
	// 			        })
	// 				}
	// 			})
	// 		}
	// 		res.json({
	// 			images: files
	// 		}, 200);
	// 		console.log('GET ALL IMAGES - ' + JSON.stringify(files));
	// 	}
	// })

	var path = process.cwd() + '/public/images';
	var directory;
	var images = [];
	function getFiles(dir){
	    var files = fs.readdirSync(dir);
	    for(var i in files){
	        if (!files.hasOwnProperty(i)) continue;
	        var name = dir+'/'+files[i];
	        if (fs.statSync(name).isDirectory()){
				directory = files[i];
	            getFiles(name);
	        }else{
	        	var image = {};
	        	image.name = files[i];
	        	image.directory = directory;
	        	images.push(image);
	        }
	    }
	}
	getFiles(path);
	res.json({
		images: images
	}, 200);
	console.log('GET ALL IMAGES - ' + JSON.stringify(images));
}

exports.getCamera = function(req, res) {
	res.json({
		settings: settings
	}, 200);
	console.log('GET CAMERA - ' + JSON.stringify(settings));
}

exports.setCamera = function(req, res) {
	settings = req.body;
 	res.json(settings, 200);
	console.log('SET CAMERA - ' + JSON.stringify(settings));
}

exports.startCamera = function(req, res) {
	settings = req.body;

	var date = new Date();
	var minutes = date.getMinutes();
	var hour = date.getHours();
	var dirname = (date.getMonth() + 1) +"-"+ date.getDate() +"-"+ date.getFullYear();
	var pathname = "public/images/" + dirname;
	var outputName = "time-taken-" + date.getHours() + "hr" + date.getMinutes() + "min";
	shell.mkdir('-p', pathname);

	var timelapse = (settings.intervalMinutes * 60000) + (settings.intervalSeconds * 1000);
	var timeout = (settings.durationHours * 3600000) + (settings.durationMinutes * 60000) + (settings.durationSeconds * 1000);

 	shell.cd(pathname);
	shell.exec("raspistill -o image%04d.jpeg -tl" + " " + timelapse + " " + "-t" + " " + timeout + " -w 1280 -h 720",function(code, output) {
	    console.log('raspistill reached. output: ' + output + ' code: ' + code);
		shell.exec("gst-launch-1.0 multifilesrc location=image%04d.jpeg index=1 caps='image/jpeg,framerate=10/1' ! jpegdec ! omxh264enc ! avimux ! filesink location=" + outputName + ".avi",function(code, output) {
		    console.log('gst-launch reached. output: ' + output + ' code: ' + code);
		    shell.rm('*jpeg');
		    shell.cd('../../..');
			var scp = "scp -r " + pathname + " jmzhwng@vergil.u.washington.edu:/nfs/bronfs/uwfs/dw00/d96/jmzhwng/Images";
			console.log("this is scp " + scp);
			shell.exec(scp,function(code, output) {
			    console.log('scp reached. output: ' + output + ' code: ' + code);
			 	res.json(settings, 200);
			});
		});
	});

	console.log('START CAMERA - ' + JSON.stringify(settings));
}

exports.stopCamera = function(req, res) {
	res.json(settings, 200);
	console.log('STOP CAMERA - ' + JSON.stringify(settings));
}

exports.getShellCommand = function(req, res) {
 	res.json(shellCommand, 200);
	console.log('GET SHELL COMMAND - ' + JSON.stringify(shellCommand.text));
}

exports.setShellCommand = function(req, res) {
	shellCommand = {
		text: req.body.text
	}
 	res.json(shellCommand, 200);
	console.log('SET SHELL COMMAND - ' + JSON.stringify(shellCommand.text));
}

exports.startShellCommand = function(req, res) {
	shell.exec(shellCommand.text,function(code, output) {
	  console.log('Exit code:', code);
	  console.log('Program output:', output);
	});
	res.json(shellCommand.text, 200);
	console.log('START SHELL COMMAND - ' + JSON.stringify(shellCommand.text));
}

exports.mihirsCommand = function(req, res) {
	var d = new Date();
	var dirname = "pics_" + d.toUTCString().replace(/\s+/g, '').replace(/:/g, '_');
	var pathname = "public/images/test";
	shell.mkdir('-p', pathname);

 	shell.cd(pathname);
	var str = "avconv -r 10 -i image%d.jpg -r 10 -vcodec libx264 -crf 20 -g 15 timelapse.mp4"
	shell.exec(str,function(code, output) {
		console.log('Exit code:', code);
	    console.log('Program output:', output);
	    console.log('avconv reached');
	});

	res.json(200);
}