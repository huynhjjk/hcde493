'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngRoute']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/dashboard',
        controller: DashboardCtrl
      }).
      when('/gallery', {
        templateUrl: 'partials/gallery',
        controller: GalleryCtrl
      }).
      when('/settings', {
        templateUrl: 'partials/settings',
        controller: SettingsCtrl
      }).
      when('/shellCommand', {
        templateUrl: 'partials/shellCommand',
        controller: ShellCommandCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);