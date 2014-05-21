'use strict';

/* Filters */

var app = angular.module('myApp.filters', [])
app.filter('filePath', function() {
    return function(image) {
      var webUrl = "http://students.washington.edu/jmzhwng/Images/"
      return webUrl + image;
    }
});
app.filter('reverse', function() {
  return function(items) {
    if (items && (items.length > 1)) {
      return items.slice().reverse();
    } else {
      return items;
    }
  };
});