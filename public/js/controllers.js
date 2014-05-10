'use strict';

/* Controllers */
function DashboardCtrl($scope, $http, $route) {
  $scope.intervalMinutes = [0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  $scope.intervalSeconds = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  $scope.durationHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  $scope.durationMinutes = [0, 1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  $scope.durationSeconds = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  /*$scope.videoLength = ($scope.intervalMinutes * 60000) + ($scope.intervalSeconds * 1000);*/
  
  $scope.fps = [10, 15, 20, 25, 30];

  $http.get('/getCamera').
    success(function(data, status, headers, config) {
      $scope.settings = data.settings;
      console.log('Camera settings has been retrieved.')
    });

  $http.get('/getAllFiles').
    success(function(data, status, headers, config) {
      $scope.files = data.files;
      console.log('All files has been retrieved.');
    });

  $scope.startCamera = function () {
    var $btn = $("#startButton");
    $btn.attr('disabled', true);
    console.log('Camera has started.')
    $http.put('/startCamera', $scope.settings).
      success(function(data, status, headers, config) {
          console.log('Camera has stopped and files have been converted.')
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
}

function GalleryCtrl($scope, $http, $route, $routeParams) {
  $scope.folderName = $routeParams.folderName;
  $http.get('/getFiles/' + $scope.folderName).
    success(function(data, status, headers, config) {
      $scope.files = data.files;
      console.log('Files has been retrieved.');
    });
}