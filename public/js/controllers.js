'use strict';

/* Controllers */
function DashboardCtrl($scope, $http, $route) {
  $scope.intervalMinutes = [0, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  $scope.intervalSeconds = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  $scope.durationHours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  $scope.durationMinutes = [0, 1, 2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  $scope.durationSeconds = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  
  $scope.fps = [10, 15, 20, 25, 30];

	$scope.videoLength = 0;

  $http.get('/getCamera').
    success(function(data, status, headers, config) {
      $scope.settings = data.settings;
		$scope.$watch('[settings.intervalMinutes, settings.intervalSeconds, settings.durationHours, settings.durationMinutes, settings.durationSeconds, settings.fps]', function () {
			$scope.videoLength = ((($scope.settings.durationHours) + ($scope.settings.durationMinutes) + ($scope.settings.durationSeconds)) /
								(($scope.settings.intervalMinutes) + ($scope.settings.intervalSeconds))) /
								($scope.settings.fps);
		}, true);
      console.log('Camera settings has been retrieved.')
    });

  $http.get('/getAllFiles').
    success(function(data, status, headers, config) {
      $scope.files = data.files;
      console.log('All files has been retrieved.');
    });

  $scope.startCamera = function () {
  	if ($scope.checkValidations()) {
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
  }

  $scope.stopCamera = function () {
    $http.get('/stopCamera').
      success(function(data, status, headers, config) {
        console.log('Camera has stopped.')
    });
  }

  	// Validations
  	$scope.checkValidations = function() {
		return $scope.isIntervalMinutesComplete() && $scope.isIntervalSecondsComplete() 
		&& $scope.isDurationHoursComplete() && $scope.isDurationMinutesComplete() 
		&& $scope.isDurationSecondsComplete() && $scope.isFPSComplete()
		&& $scope.isDurationGreaterThanInterval();
  	}

	$scope.isIntervalMinutesComplete = function() {
        $scope.displayIntervalMinutesWarning = ($scope.settings.intervalMinutes == null) || ($scope.settings.intervalMinutes < 0);
        return ($scope.displayIntervalMinutesWarning) ? false:true;
	}
	$scope.isIntervalSecondsComplete = function() {
        $scope.displayIntervalSecondsWarning = ($scope.settings.intervalSeconds == null) || ($scope.settings.intervalSeconds < 0);
        return ($scope.displayIntervalSecondsWarning) ? false:true;
	}
	$scope.isDurationHoursComplete = function() {
        $scope.displayDurationHoursWarning = ($scope.settings.durationHours == null) || ($scope.settings.durationHours < 0);
        return ($scope.displayDurationHoursWarning) ? false:true;
	}
	$scope.isDurationMinutesComplete = function() {
        $scope.displayDurationMinutesWarning = ($scope.settings.durationMinutes == null) || ($scope.settings.durationMinutes < 0);
        return ($scope.displayDurationMinutesWarning) ? false:true;
	}
	$scope.isDurationSecondsComplete = function() {
        $scope.displayDurationSecondsWarning = ($scope.settings.durationSeconds == null) || ($scope.settings.durationSeconds < 0);
        return ($scope.displayDurationSecondsWarning) ? false:true;
	}
	$scope.isFPSComplete = function() {
        $scope.displayFPSWarning = ($scope.settings.fps == null) || ($scope.settings.fps < 0);
        return ($scope.displayFPSWarning) ? false:true;
	}
	$scope.isDurationGreaterThanInterval = function() {
        $scope.displayDurationWarning = 
			(($scope.settings.intervalMinutes * 60000) + ($scope.settings.intervalSeconds * 1000)) >=
			(($scope.settings.durationHours * 3600000) + ($scope.settings.durationMinutes * 60000) + ($scope.settings.durationSeconds * 1000));
        return ($scope.displayDurationWarning) ? false:true;
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