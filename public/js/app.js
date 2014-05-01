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
      when('/listPost', {
        templateUrl: 'partials/listPost',
        controller: ListPostCtrl
      }).
      when('/addPost', {
        templateUrl: 'partials/addPost',
        controller: AddPostCtrl
      }).
      when('/readPost/:id', {
        templateUrl: 'partials/readPost',
        controller: ReadPostCtrl
      }).
      when('/editPost/:id', {
        templateUrl: 'partials/editPost',
        controller: EditPostCtrl
      }).
      when('/deletePost/:id', {
        templateUrl: 'partials/deletePost',
        controller: DeletePostCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);