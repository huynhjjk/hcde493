'use strict';

/* Filters */

var app = angular.module('myApp.filters', [])
app.filter('folderPath', function() {
    return function(folderName) {
      var folderUrl = "#/folders/"
      return folderUrl + folderName
    }
});
app.filter('filePath', function() {
    return function(image, folderName) {
      var baseUrl = "http://students.washington.edu/jmzhwng/Images/"
      return baseUrl + folderName + "/" + image;
    }
});
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});