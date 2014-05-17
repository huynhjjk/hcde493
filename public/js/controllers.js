'use strict';

/* Controllers */
function DashboardCtrl($scope, $http, $route, $filter) {
  $http.get('/getCamera').
    success(function(data, status, headers, config) {
      $scope.settings = data.settings;
  		$scope.$watch('[settings.intervalMinutes, settings.intervalSeconds, settings.durationHours, settings.durationMinutes, settings.durationSeconds, settings.fps]', function () {
  			var msDuration = ($scope.settings.durationHours * 3600000) + ($scope.settings.durationMinutes * 60000) + ($scope.settings.durationSeconds * 1000)
        var msInterval = (($scope.settings.intervalMinutes * 60000) + ($scope.settings.intervalSeconds * 1000))
        var msFps = ($scope.settings.fps);
        var ms = (msDuration / msInterval) / (msFps);
        $scope.videoLength = $scope.msToTime(ms * 1000);
        $scope.settings.outputName = $filter('date')(new Date(), 'M-d-yy-h-mm-a');
  		}, true);
      $scope.countdown = new Date($scope.settings.lock);
      $scope.displayCountDown = ($scope.countdown > new Date());

      console.log('Camera settings has been retrieved.')
    });

  $http.get('/getAllFiles').
    success(function(data, status, headers, config) {
      $scope.files = data.files;
      console.log('All files has been retrieved.');
    });
  $scope.startCamera = function () {
  	if ($scope.checkValidations()) {
	    $http.put('/startCamera', $scope.settings).
	      success(function(data, status, headers, config) {
          console.log('Camera has stopped and files have been converted.')
          $route.reload();
	    }).
      error(function(data, status, headers, config) {
          alert('Camera has already started. Please wait until ' + $filter('date')($scope.countdown, 'MMM d, y h:mm:ss a'))
      });
  	}
  }

  $scope.stopCamera = function () {
    $http.get('/stopCamera').
      success(function(data, status, headers, config) {
        $route.reload();
        console.log('Camera has stopped.')
    });
  }

  $scope.deleteFile = function (fileName) {
    $http.delete('/deleteFile/' + fileName).
      success(function(data, status, headers, config) {
        console.log('file has been deleted.');
        $route.reload();
      });
  };

  $scope.msToTime = function(duration) {
    var seconds = parseInt((duration/1000)%60)
    , minutes = parseInt((duration/(1000*60))%60)
    , hours = parseInt((duration/(1000*60*60))%24);

    hours = (hours < 10) ? hours : hours;
    minutes = (minutes < 10) ? minutes : minutes;
    seconds = (seconds < 10) ? seconds : seconds;

    return hours + " hours, " + minutes + " minutes, " + seconds + " seconds";
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

function VideosCtrl($scope, $http, $route) {
  $http.get('/getAllFiles').
    success(function(data, status, headers, config) {
      $scope.files = data.files;
      console.log('All files has been retrieved.');
    });
  $scope.deleteFile = function (fileName) {
    $http.delete('/deleteFile/' + fileName).
      success(function(data, status, headers, config) {
        console.log('file has been deleted.');
        $route.reload();
      });
  };
}