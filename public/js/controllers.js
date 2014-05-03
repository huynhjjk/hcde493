'use strict';

/* Controllers */
function DashboardCtrl($scope, $http, $route) {

  /* Pretend you have already set your timelapse settings and decide to visit
  the dashboard page again. You will get this data from the backend (using http.get(/getCamera),
  which has your previous settings */
  $http.get('/getCamera').
    success(function(data, status, headers, config) {
      $scope.settings = data.settings;
      console.log('Camera settings has been retrieved.')
    });

    // This is what you are getting from $scope.settings in the backend
    // hours: 2, < -- Bind to html form using ng-model="$scope.settings.hours"
    // minutes: 15,  < -- Bind to html form using ng-model="$scope.settings.minutes"
    // seconds: 30,  < -- Bind to html form using ng-model="$scope.settings.seconds"
    // fps: 5,  < -- Bind to html form using ng-model="$scope.settings.fps"
    // startDate: new Date("May 3, 2014 9:30:00"), < -- $scope.settings.startDate will be used for datepicker and timepicker
    // endDate: new Date("May 4, 2014 12:00:00") < -- $scope.settings.endDate will be used for datepicker and timepicker

  /* In your html file, just bind your form fields to $scope.settings 
    (i.e. settings.hours, settings.startDate, settings.fps, etc..)
    Check if the settings JSON object dynamically change whenever you input a different value
    I provided a <pre></pre> tag so you can see test to see if JSON data changes from changing field values. 
    If it changes, it is successfully bounded
  */

  // Press Temp Start Button to get an alert and see what data you are passing to backend
  $scope.tempStartCamera = function() {
    alert("This will be sent to backend " + JSON.stringify($scope.settings));
  }

  /* WRITE YOUR CODE ABOVE THIS LINE AND DON'T BOTHER LOOKING ANYTHING BELOW THIS*/

  $http.get('/getAllImages').
    success(function(data, status, headers, config) {
      $scope.images = data.images;
      console.log('All Images has been retrieved.');
    });

  $scope.startCamera = function () {
    var $btn = $("#start");
    $btn.attr('disabled', true);
    console.log('Camera has started.')
    $http.get('/startCamera').
      success(function(data, status, headers, config) {
        console.log('Camera has stopped.')
        $btn.attr('disabled', false);
        $route.reload();
    });
  }

  $scope.stopCamera = function () {
    $http.get('/stopCamera').
      success(function(data, status, headers, config) {
        console.log('Camera has stopped.')
    });
  }

}

function FoldersCtrl($scope, $http, $route) {
  $http.get('/getFolders').
    success(function(data, status, headers, config) {
      $scope.folders = data.folders;
      console.log('folders has been retrieved.');
    });

  $scope.deleteFolder = function (folderName) {
    $http.delete('/deleteFolder/' + folderName).
      success(function(data, status, headers, config) {
        console.log('folder has been deleted.');
        $route.reload();
      });
  };
}

function GalleryCtrl($scope, $http, $route, $routeParams) {
  $scope.folderName = $routeParams.folderName;
  $http.get('/getImages/' + $scope.folderName).
    success(function(data, status, headers, config) {
      $scope.images = data.images;
      console.log('Images has been retrieved.');
    });

  $scope.deleteImage = function (imageName) {
    $http.delete('/deleteImage/' + $scope.folderName + '/' + imageName).
      success(function(data, status, headers, config) {
        console.log('image has been deleted.');
        $route.reload();
      });
  };
}

function SettingsCtrl($scope, $http) {
  $http.get('/getCamera').
    success(function(data, status, headers, config) {
      $scope.settings = data.settings;
      console.log('Camera settings has been retrieved.')
    });

  $scope.setCamera = function () {
    $http.put('/setCamera', $scope.settings).
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
      success(function(data, status, headers, config) {
        console.log('Shell Command has been set.')
    });
  }

  $scope.startShellCommand = function () {
    $http.get('/startShellCommand').
      success(function(data, status, headers, config) {
        console.log('Camera has started.')
    });
  }

  $scope.mihirsCommand = function () {
    $http.get('/mihirsCommand').
      success(function(data, status, headers, config) {
        console.log('Mihirs command executed')
    });
  }

}