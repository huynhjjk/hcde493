var RaspiCam = require("raspicam");

// default settings
var setting = {
	mode: "timelapse",
	output: "./images/image_%06d.jpg", // image_000001.jpg, image_000002.jpg,...
	encoding: "jpg",
	timelapse: 3000, // take a picture every 3 seconds
	timeout: 12000 // take a total of 4 pictures over 12 seconds
}

var images = [];

exports.getImages = function(req, res) {
	res.json({
		images: images
	}, 200);
	console.log('GET IMAGES - ' + JSON.stringify(images));
}

exports.getCamera = function(req, res) {
	res.json({
		setting: setting
	}, 200);
	console.log('GET CAMERA - ' + JSON.stringify(setting));
}

exports.setCamera = function(req, res) {
	setting = {
		mode: req.body.mode,
		output: req.body.output,
		encoding: req.body.encoding,
		timelapse: req.body.timelapse,
		timeout: req.body.timeout
	}
	req.body;
 	res.json(setting, 200);
	console.log('SET CAMERA - ' + JSON.stringify(setting));
}

exports.startCamera = function(req, res) {
	var camera = new RaspiCam(setting);
	camera.on("start", function( err, timestamp ){
	  console.log("timelapse started at " + timestamp);
	});

	camera.on("read", function( err, timestamp, filename ){
	  console.log("timelapse image captured with filename: " + filename);
	  images.push(filename);
	});

	camera.on("exit", function( timestamp ){
	  console.log("timelapse child process has exited");
	});

	camera.on("stop", function( err, timestamp ){
	  console.log("timelapse child process has been stopped at " + timestamp);
	});

	camera.start();

	setTimeout(function(){
	  camera.stop();
	}, setting.timeout);

 	res.json(setting, 200);
	console.log('START CAMERA - ' + JSON.stringify(setting));
}

exports.stopCamera = function(req, res) {
	camera.stop();
	res.json(setting, 200);
	console.log('STOP CAMERA - ' + JSON.stringify(setting));
}