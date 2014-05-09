'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'ngRoute', 'ui.bootstrap']).
  config(['$sceProvider', function($sceProvider) {
      $sceProvider.enabled(false);
  }]).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/dashboard',
        controller: DashboardCtrl
      }).
      when('/folders', {
        templateUrl: 'partials/folders',
        controller: FoldersCtrl
      }).
      when('/folders/:folderName', {
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