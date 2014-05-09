'use strict';

/* Filters */

var app = angular.module('myApp.filters', [])
app.filter('imagePath', function() {
    return function(image, folderName) {
      var url = "http://students.washington.edu/jmzhwng/Images/" + folderName + "/" + image
      return url
    }
  });