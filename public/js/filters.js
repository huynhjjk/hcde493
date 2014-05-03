'use strict';

/* Filters */

var app = angular.module('myApp.filters', [])
app.filter('imagePath', function() {
    return function(image, folderName) {
      return "images/" + folderName + "/" + image;
    }
  });