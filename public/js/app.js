'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngRoute', 'ui.bootstrap', 'timer']).
  config(['$sceProvider', function($sceProvider) {
      $sceProvider.enabled(false);
  }]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/dashboard',
        controller: DashboardCtrl
      }).
      when('/videos', {
        templateUrl: 'partials/videos',
        controller: VideosCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);