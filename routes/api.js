// var RaspiCam = require("raspicam");

// var camera = new RaspiCam({
//   mode: "timelapse",
//   output: "./timelapse/image_%06d.jpg", // image_000001.jpg, image_000002.jpg,...
//   encoding: "jpg",
//   timelapse: 3000, // take a picture every 3 seconds
//   timeout: 12000 // take a total of 4 pictures over 12 seconds
// });

// camera.on("start", function( err, timestamp ){
//   console.log("timelapse started at " + timestamp);
// });

// camera.on("read", function( err, timestamp, filename ){
//   console.log("timelapse image captured with filename: " + filename);
// });

// camera.on("exit", function( timestamp ){
//   console.log("timelapse child process has exited");
// });

// camera.on("stop", function( err, timestamp ){
//   console.log("timelapse child process has been stopped at " + timestamp);
// });

// camera.start();

// // test stop() method before the full 12 seconds is up
// setTimeout(function(){
//   camera.stop();
// }, 10000);  

/*
 * Serve JSON to our AngularJS client
 */

// For a real app, you'd make database requests here.
// For this example, "data" acts like an in-memory "database"
var data = {
  "posts": [
    {
      "title": "Lorem ipsum",
      "text": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    },
    {
      "title": "Sed egestas",
      "text": "Sed egestas, ante et vulputate volutpat, eros pede semper est, vitae luctus metus libero eu augue. Morbi purus libero, faucibus adipiscing, commodo quis, gravida id, est. Sed lectus."
    }
  ]
};

// GET

exports.posts = function (req, res) {
  var posts = [];
  data.posts.forEach(function (post, i) {
    posts.push({
      id: i,
      title: post.title,
      text: post.text.substr(0, 50) + '...'
    });
  });
  res.json({
    posts: posts
  });
};

exports.post = function (req, res) {
  var id = req.params.id;
  if (id >= 0 && id < data.posts.length) {
    res.json({
      post: data.posts[id]
    });
  } else {
    res.json(false);
  }
};

// POST

exports.addPost = function (req, res) {
  data.posts.push(req.body);
  res.json(req.body);
};

// PUT

exports.editPost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts[id] = req.body;
    res.json(true);
  } else {
    res.json(false);
  }
};

// DELETE

exports.deletePost = function (req, res) {
  var id = req.params.id;

  if (id >= 0 && id < data.posts.length) {
    data.posts.splice(id, 1);
    res.json(true);
  } else {
    res.json(false);
  }
};