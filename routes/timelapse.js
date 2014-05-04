var shell = require('shelljs');
var fs = require('fs');
var RaspiCam = require("raspicam");
var camera;

var shellCommand = {
	text: "raspistill" + " " + "-t" + " " + 3000 + " " + "-tl" + " " + 1000 + " " + "-o" + " " + "public/images/image%d.jpg"
}

var settings = {
	intervalHours: 0,
	intervalMinutes: 0,
	intervalSeconds: 3,
	fps: 10,
	durationHours: 0,
	durationMinutes: 0,
	durationSeconds: 12,
	startDate: new Date("May 3, 2014 9:30:00"),
	endDate: new Date("May 4, 2014 12:00:00")
}

// var options = {
// 	mode: "timelapse",
// 	output: "public/images/image%d.jpg",
// 	encoding: "jpg",
// 	timelapse: (settings.intervalHours * 3600000) + (settings.intervalMinutes * 60000) + (settings.intervalSeconds * 1000),
// 	timeout: settings.endDate - settings.startDate,
// 	width: 1000,
// 	height: 1000
// }

// console.log(JSON.stringify(options));

exports.getFolders = function(req, res) {
	var path = process.cwd() + '/public/images';
	fs.readdir(path, function (err, folders) {
	  if (err) {
	    console.log(err);
	    return;
	  }
		res.json({
			folders: folders
		}, 200);
		console.log('GET FOLDERS - ' + JSON.stringify(folders));
	});
}

exports.deleteFolder = function (req, res) {
  var path = process.cwd() + '/public/images/' + req.params.folderName;
  if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
	res.json(req.params.folderName, 200);
	console.log('DELETE FOLDER - ' + JSON.stringify(req.params.folderName));
  } else {
	res.json(req.params.folderName, 504);  	
  }
};

exports.getAllImages = function(req, res) {
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

exports.getImages = function(req, res) {
  var path = process.cwd() + '/public/images/' + req.params.folderName;
	fs.readdir(path, function (err, files) {
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
	var path = process.cwd() + '/public/images/' + req.params.folderName + '/' + req.params.imageName;
	  if( fs.existsSync(path) ) {
		fs.unlink(path, function (err) {
		  if (err) {
			console.log(err);
			return;	  	
		  } 
			res.json(req.params.imageName, 200);
			console.log('DELETE IMAGE - ' + JSON.stringify(req.params.imageName));
		});
	} else {
		res.json(req.params.imageName, 504)		
	}
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
		output: "public/images/test/image%d.jpg",
		encoding: "jpg",
		timelapse: (settings.intervalHours * 3600000) + (settings.intervalMinutes * 60000) + (settings.intervalSeconds * 1000),
		timeout: (settings.durationHours * 3600000) + (settings.durationMinutes * 60000) + (settings.durationSeconds * 1000),
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
	var d = new Date();
	var dirname = "pics_" + d.toUTCString().replace(/\s+/g, '').replace(/:/g, '_');
	var pathname = "public/images/" + dirname;
	shell.mkdir('-p', pathname);

	//Seconds to millisecond
	var interval =  1000;
	//Hours to millisecond
	// var hours = 3600000 * ___________
	//Minutes to millisecond
	// var minutes = 60000 * ___________
	var duration = 10000;

	var timelapse = "raspistill" + " " + "-t" + " " + interval + " " + "-tl" + " " + duration + " " + "-o" + " " + pathname + "/lapse_%04d.jpg";
	shell.exec(timelapse,function(code, output) {
	    console.log('Exit code:', code);
	    console.log('Program output:', output);
	    console.log('timelapse reached');
	});

	var scp = "scp -r " + pathname + " jmzhwng@vergil.u.washington.edu:/nfs/bronfs/uwfs/dw00/d96/jmzhwng/Images";
	shell.exec(scp,function(code, output) {
	    console.log('Exit code:', code);
	    console.log('Program output:', output);
	    console.log('scp reached');
	});

	var str = "avconv -r 10 -i lapse_%04d.jpg -r 10 -vcodec libx264 -crf 20 -g 15 timelapse.mp4"
	shell.exec(str,function(code, output) {
		console.log('Exit code:', code);
	    console.log('Program output:', output);
	    console.log('avconv reached');
	});
	shell.rm('-rf', pathname);
	console.log('folder removed');

	// shell.cd('bash_scripts');
	// shell.exec('./time.sh ' + 10 + ' ' + 0 + ' ' + 1,function(code, output) {
	//   console.log('Exit code:', code);
	//   console.log('Program output:', output);
	// });
	// shell.cd('..');
	res.json(200);
}