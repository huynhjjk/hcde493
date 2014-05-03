'use strict';

/* Controllers */
function DashboardCtrl($scope, $http, $route) {

  /* Pretend you have already set your timelapse settings and decide to visit
  the dashboard page again. You will get this data from the backend (using http.get(/getCamera),
  which has your previous settings */
  var backEnd = {
    settings: {
      mode: "timelapse", 
      output: "public/images/image%d.jpg", 
      encoding: "jpg", 
      timelapse: 3000, // User will ONLY be able to modify this on dashboard page, based on your UI
      timeout: 12000, // User will ONLY be able to modify this on dashboard page, based on your UI
      width: 1000, 
      height: 1000 
    },
    fps: 2 // User will ONLY be able to modify this on dashboard page, based on your UI
  }

  /* Based on your UI for Interval, you will need to convert backEnd.settings.timelapse 
  from milliseconds into individual hours, minutes, and seconds */
  $scope.hours = 2 * backEnd.settings.timelapse;
  $scope.minutes = 20 * backEnd.settings.timelapse;
  $scope.seconds = 10 * backEnd.settings.timelapse;

  // FPS should be an integer and not a string
  $scope.fps = backEnd.fps;

  /* Based on your UI for Timeout, you will need to convert backEnd.settings.timeout 
  from milliseconds into  individual date objects consisting of startdate, endDate, startTime, and endTime */
  $scope.startDate = 1 * backEnd.settings.timeout;
  $scope.startTime = 1 * backEnd.settings.timeout;
  $scope.endDate = 2 * backEnd.settings.timeout;
  $scope.endTime = 2 * backEnd.settings.timeout;


  // Press Temp Start Button to get an alert and see what data you are passing to backend
  $scope.tempStartCamera = function() {
    var data = {};
    data.settings = {
      mode: "timelapse", // will not be changed
      output: "public/images/image%d.jpg", // will not be changed
      encoding: "jpg", // will not be changed
      timelapse: ($scope.hours * 60 * 60) + ($scope.minutes * 60) + ($scope.seconds * 1), // convert date objects back to milliseconds
      timeout: ($scope.endDate + $scope.endTime) - ($scope.startDate + $scope.startTime), // convert date objects back to milliseconds
      width: 1000, // will not be changed
      height: 1000 // will not be changed
    }
    data.fps = $scope.fps; // FPS should still be an integer and not a string

    alert("This will be sent to backend " + JSON.stringify(data));
  }




  /* WRITE YOUR CODE ABOVE THIS LINE AND DON'T BOTHER LOOKING ANYTHING BELOW THIS*/

  $http.get('/getCamera').
    success(function(data, status, headers, config) {
      $scope.setting = data.setting;
      console.log('Camera settings has been retrieved.')
    });

  $http.get('/getImages').
    success(function(data, status, headers, config) {
      $scope.images = data.images;
      console.log('Images has been retrieved.' + JSON.stringify($scope.images));
    });

  $scope.startCamera = function () {
    var $btn = $("#start");
    $btn.attr('disabled', true);
    console.log('Camera has started.')
    $http.get('/startCamera').
      success(function(data, status) {
        console.log('Camera has stopped.')
        $btn.attr('disabled', false);
        $route.reload();
    });
  }

  $scope.stopCamera = function () {
    $http.get('/stopCamera').
      success(function(data, status) {
        console.log('Camera has stopped.')
    });
  }

  $scope.deleteImage = function (imageFile) {
    $http.delete('/deleteImage/' + imageFile).
      success(function(data) {
        console.log(data + ' has been deleted.');
        $route.reload();
      });
  };
}

function GalleryCtrl($scope, $http, $route) {
  $http.get('/getImages').
    success(function(data, status, headers, config) {
      $scope.images = data.images;
      console.log('Images has been retrieved.' + JSON.stringify($scope.images));
    });

  $scope.deleteImage = function (imageFile) {
    $http.delete('/deleteImage/' + imageFile).
      success(function(data) {
        console.log(data + ' has been deleted.');
        $route.reload();
      });
  };
}

function SettingsCtrl($scope, $http) {
  $http.get('/getCamera').
    success(function(data, status, headers, config) {
      $scope.setting = data.setting;
      console.log('Camera settings has been retrieved.')
    });

  $scope.setCamera = function () {
    $http.put('/setCamera', $scope.setting).
      success(function(data, status) {
        console.log('Camera has been set.')
    });
  }
}

function ShellCommandCtrl($scope, $http) {
  $http.get('/getShellCommand').
    success(function(data, status, headers, config) {
      $scope.shellCommand = data;
      console.log('Shell Command has been retrieved.')
    });

  $scope.setShellCommand = function () {
    $http.put('/setShellCommand', $scope.shellCommand).
      success(function(data, status) {
        console.log('Shell Command has been set.')
    });
  }

  $scope.startShellCommand = function () {
    $http.get('/startShellCommand').
      success(function(data, status) {
        console.log('Camera has started.')
    });
  }

  $scope.mihirsCommand = function () {
    $http.get('/mihirsCommand').
      success(function(data, status) {
        console.log('Mihirs command executed')
    });
  }

}

function ListPostCtrl($scope, $http) {
  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });
}

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/listPost');
      });
  };
}

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/listPost');
      });
  };
}