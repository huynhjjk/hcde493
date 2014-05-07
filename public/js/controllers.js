'use strict';

/* Controllers */
function DashboardCtrl($scope, $http, $route) {
  $scope.intervalMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  $scope.intervalSeconds = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  $scope.durationHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  $scope.durationMinutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  $scope.durationSeconds = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  $scope.fps = [1, 5, 10, 15, 20, 25, 30];

  $http.get('/getCamera').
    success(function(data, status, headers, config) {
      $scope.settings = data.settings;
      console.log('Camera settings has been retrieved.')
    });

  $http.get('/getAllImages').
    success(function(data, status, headers, config) {
      $scope.images = data.images;
      console.log('All Images has been retrieved.');
    });

  $scope.startCamera = function () {
    var $btn = $("#startButton");
    $btn.attr('disabled', true);
    console.log('Camera has started.')
    $http.put('/startCamera', $scope.settings).
      success(function(data, status, headers, config) {

      // $http.get('/convertImages/' + data.dirname).
      //   success(function(data, status, headers, config) {
          console.log('Camera has stopped and images have been converted.')
          $btn.attr('disabled', false);
          $route.reload();
        // });

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