var shell = require('shelljs');
var fs = require('fs');
var RaspiCam = require("raspicam");
var camera;

var settings = {
	hours: 2,
	minutes: 15,
	seconds: 30,
	fps: 5,
	startDate: new Date("May 3, 2014 9:30:00"),
	endDate: new Date("May 4, 2014 12:00:00")
}

var options = {
	mode: "timelapse",
	output: "public/images/image%d.jpg",
	encoding: "jpg",
	timelapse: (settings.hours * 3600000) + (settings.minutes * 60000) + (settings.seconds * 1000),
	timeout: settings.endDate - settings.startDate,
	width: 1000,
	height: 1000
}

console.log(JSON.stringify(options));

exports.getImages = function(req, res) {
	fs.readdir(process.cwd() + '/public/images', function (err, files) {
	  if (err) {
	    console.log(err);
	    return;
	  }
		res.json({
		images: files
		}, 200);
		console.log('GET IMAGES - ' + JSON.stringify(files));
	});
}

exports.deleteImage = function (req, res) {
  var imageName = req.params.imageFile;
	fs.unlink(process.cwd() + '/public/images/' + imageName, function (err) {
	  if (err) {
		console.log(err);
		return;	  	
	  } 
		res.json(imageName, 200);
		console.log('DELETE IMAGE - ' + JSON.stringify(imageName));
	});
};

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
	var options = {
		mode: "timelapse",
		output: "public/images/image%d.jpg",
		encoding: "jpg",
		timelapse: (settings.hours * 3600000) + (settings.minutes * 60000) + (settings.seconds * 1000),
		timeout: settings.endDate - settings.startDate, // settings must be date objects to work
		width: 1000,
		height: 1000
	}
	// camera = new RaspiCam(options);

	// camera.on("start", function( err, timestamp ){
	//   console.log("timelapse started at " + timestamp);
	// });

	// camera.on("read", function( err, timestamp, filename ){
	//   console.log("timelapse image captured with filename: " + filename);
	// });

	// camera.on("exit", function( timestamp ){
	//   console.log("timelapse child process has exited");
 // 	  res.json(options, 200);
	// });

	// camera.on("stop", function( err, timestamp ){
	//   console.log("timelapse child process has been stopped at " + timestamp);
	// });

	// camera.start();

	// setTimeout(function(){
	//   camera.stop();
	// }, options.timeout + 3000);

	console.log('START CAMERA - ' + JSON.stringify(options));
}

exports.stopCamera = function(req, res) {
	console.log('What is camera in stopCamera function? ' + camera);
    if(camera && typeof(camera.stop) == "function") {
        camera.stop();
    }
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
	shell.cd('bash_scripts');
	shell.exec('./time.sh ' + 10 + ' ' + 0 + ' ' + 1,function(code, output) {
	  console.log('Exit code:', code);
	  console.log('Program output:', output);
	});
	shell.cd('..');
	res.json(200);
}