var shell = require('shelljs');
 
shell.exec("raspistill" + " " + "-t" + " " + 3000 + " " + "-tl" + 1000 + " " + "-o" + " " + "public/images/image%d.jpg");
// shell.cd('bash_scripts');
// shell.exec('./time.sh ' + 10 + ' ' + 0 + ' ' + 1);


var fs = require('fs');
var RaspiCam = require("raspicam");
var camera;

// default settings
var setting = {
	mode: "timelapse",
	output: "public/images/image%d.jpg", // image_000001.jpg, image_000002.jpg,...
	encoding: "jpg",
	timelapse: 3000, // take a picture every 3 seconds
	timeout: 12000 // take a total of 4 pictures over 12 seconds
}

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
 	res.json(setting, 200);
	console.log('SET CAMERA - ' + JSON.stringify(setting));
}

exports.startCamera = function(req, res) {
	camera = new RaspiCam(setting);

	camera.on("start", function( err, timestamp ){
	  console.log("timelapse started at " + timestamp);
	});

	camera.on("read", function( err, timestamp, filename ){
	  console.log("timelapse image captured with filename: " + filename);
	});

	camera.on("exit", function( timestamp ){
	  console.log("timelapse child process has exited");
 	  res.json(setting, 200);
	});

	camera.on("stop", function( err, timestamp ){
	  console.log("timelapse child process has been stopped at " + timestamp);
	});

	camera.start();

	setTimeout(function(){
	  camera.stop();
	}, setting.timeout + 1000);

	console.log('START CAMERA - ' + JSON.stringify(setting));
}

exports.stopCamera = function(req, res) {
	console.log('What is camera in stopCamera function? ' + camera);
    if(camera && typeof(camera.stop) == "function") {
        camera.stop();
    }
	res.json(setting, 200);
	console.log('STOP CAMERA - ' + JSON.stringify(setting));
}