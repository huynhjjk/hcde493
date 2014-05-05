var shell = require('shelljs');
var fs = require('fs');
var RaspiCam = require("raspicam");
var camera;

var shellCommand = {
	text: "raspistill" + " " + "-t" + " " + 3000 + " " + "-tl" + " " + 1000 + " " + "-o" + " " + "public/images/image%d.jpg"
}

var settings = {
	intervalMinutes: 0,
	intervalSeconds: 3,
	durationHours: 0,
	durationMinutes: 0,
	durationSeconds: 12,
	fps: 10
}

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

exports.convertImages = function(req, res) {
	var dirname = req.params.folderName;
	var pathname = process.cwd() + "public/images/" + dirname;
	shell.cd(pathname);
	shell.exec("avconv -r 1 -i image%04d.jpeg -r 1 -vcodec libx264 -crf 20 -g 15 -vf scale=1280:720 timelapse.mp4",function(code, output) {
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
}

exports.startCamera = function(req, res) {
	settings = req.body;

	var d = new Date();
	var dirname = "pics_" + d.toUTCString().replace(/\s+/g, '').replace(/:/g, '_');
	var pathname = process.cwd() + "public/images/" + dirname;
	var output = "image%d.jpg";
	shell.mkdir('-p', pathname);

	var timelapse = (settings.intervalMinutes * 60000) + (settings.intervalSeconds * 1000);
	var timeout = (settings.durationHours * 3600000) + (settings.durationMinutes * 60000) + (settings.durationSeconds * 1000);


	// "gst-launch-1.0 multifilesrc location=image%04d.jpeg index=1 caps='image/jpeg,framerate=10/1' ! jpegdec ! omxh264enc ! avimux ! filesink location=timelapse.avi"

 	shell.cd(pathname);
	shell.exec("raspistill -o image%04d.jpeg -tl" + " " + timelapse + " " + "-t" + " " + timeout + " -w 1920 -h 1080",function(code, output) {
	    console.log('raspistill reached. output: ' + output + ' code: ' + code);
		// shell.exec("avconv -r 1 -i image%04d.jpeg -r 1 -vcodec libx264 -crf 20 -g 15 -vf scale=1280:720 timelapse.mp4",function(code, output) {
		//     console.log('gst-launch reached. output: ' + output + ' code: ' + code);
		//     shell.rm('*jpeg');
		    shell.cd('../../..');
		// 	var scp = "scp -r " + pathname + " jmzhwng@vergil.u.washington.edu:/nfs/bronfs/uwfs/dw00/d96/jmzhwng/Images";
		// 	console.log("this is scp " + scp);
		// 	shell.exec(scp,function(code, output) {
		// 	    console.log('scp reached. output: ' + output + ' code: ' + code);
			 	res.json(settings, 200);
		// 	});
		// });
	});

	// var options = {
	// 	mode: "timelapse",
	// 	output: output,
	// 	encoding: "jpg",
	// 	timelapse: (settings.intervalMinutes * 60000) + (settings.intervalSeconds * 1000),
	// 	timeout: (settings.durationHours * 3600000) + (settings.durationMinutes * 60000) + (settings.durationSeconds * 1000),
	// 	width: 1000,
	// 	height: 1000
	// }

	// camera = new RaspiCam(options);

	// camera.on("start", function( err, timestamp ){
	//   console.log("timelapse started at " + timestamp);
	// });

	// camera.on("read", function( err, timestamp, filename ){
	//   console.log("timelapse image captured with filename: " + filename);
	// });

	// camera.on("exit", function( timestamp ){
	//   console.log("timelapse child process has exited");
	//  	shell.cd(pathname);
	// 	//settings.fps
	// 	var str = "gst-launch-1.0 multifilesrc location=image%d.jpg index=1 caps='image/jpeg,framerate=1/1' ! jpegdec ! omxh264enc ! avimux ! filesink location=timelapse.avi"
	// 	shell.exec(str,function(code, output) {
	// 	    console.log('avconv reached output ' + output + ' code ' + code);
	// 	    shell.rm('*jpg');
	// 	    shell.cd('../../..');
	// 		var scp = "scp -r " + pathname + " jmzhwng@vergil.u.washington.edu:/nfs/bronfs/uwfs/dw00/d96/jmzhwng/Images";
	// 		console.log("this is scp " + scp);
	// 		shell.exec(scp,function(code, output) {
	// 		    console.log('scp reached output ' + output + ' code ' + code);
	// 		 	res.json(options, 200);
	// 		});
	// 	});
	// });

	// camera.on("stop", function( err, timestamp ){
	//   console.log("timelapse child process has been stopped at " + timestamp);
	// });

	// camera.start();

	// setTimeout(function(){
	//   camera.stop();
	// }, options.timeout + 3000);

	console.log('START CAMERA - ' + JSON.stringify(settings));
}

exports.stopCamera = function(req, res) {
    // if(camera && typeof(camera.stop) == "function") {
    //     camera.stop();
    // }
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

	// var scp = "scp -r " + pathname + " jmzhwng@vergil.u.washington.edu:/nfs/bronfs/uwfs/dw00/d96/jmzhwng/Images";
	// shell.exec(scp,function(code, output) {
	//     console.log('Exit code:', code);
	//     console.log('Program output:', output);
	// });
 //    console.log('scp reached');

 	shell.cd(pathname);
	var str = "avconv -r 10 -i image%d.jpg -r 10 -vcodec libx264 -crf 20 -g 15 timelapse.mp4"
	shell.exec(str,function(code, output) {
		console.log('Exit code:', code);
	    console.log('Program output:', output);
	    console.log('avconv reached');
	});

	// shell.rm('-rf', pathname);
	// console.log('folder removed');

	// shell.cd('bash_scripts');
	// shell.exec('./time.sh ' + 10 + ' ' + 0 + ' ' + 1,function(code, output) {
	//   console.log('Exit code:', code);
	//   console.log('Program output:', output);
	// });
	// shell.cd('..');
	res.json(200);
}