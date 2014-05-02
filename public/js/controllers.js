'use strict';

/* Controllers */
function DashboardCtrl($scope, $http, $route) {
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