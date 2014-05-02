
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes')

var timelapse = require('./routes/timelapse');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/partials/:name', routes.partials);

// redirect all others to the index (HTML5 history)
// app.get('*', routes.index);

/* ------ TIMELAPSE API ------ */

// Timelapse settings
app.get('/getCamera', timelapse.getCamera);
app.put('/setCamera', timelapse.setCamera);

// Timelapse controls
app.get('/startCamera', timelapse.startCamera);
app.get('/stopCamera', timelapse.stopCamera);

// Timelapse Images
app.get('/getImages', timelapse.getImages);
app.delete('/deleteImage/:imageFile', timelapse.deleteImage);

app.get('/getShellCommand', timelapse.getShellCommand);
app.put('/setShellCommand', timelapse.setShellCommand);
app.get('/startShellCommand', timelapse.startShellCommand);

// Start server

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});