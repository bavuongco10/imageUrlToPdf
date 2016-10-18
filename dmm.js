var url = require('url');
var https = require('https');
var http = require('http');
var Q = require('q');
var fs = require('fs');
var path = require('path');
var s3 = require('s3');
var request = require('request');
var Canvas = require('canvas');
var FileReader = require('filereader');
var FileAPI = require('file-api')
  , File = FileAPI.File
  , FileList = FileAPI.FileList
  , FileReader = FileAPI.FileReader;
var Image = Canvas.Image;

var width = 972;
var height = 1121;
var canvas = new Canvas(parseInt(width), parseInt(height), 'pdf');
var context = canvas.getContext('2d');
var imgdest = '/home/buithanhbavuong/img.png';
var dest = '/home/buithanhbavuong/pdf.pdf';

var download = function(uri, dest) {
  var defered = Q.defer();
  request.head(uri, function(err, res, body) {
    request(uri).pipe(fs.createWriteStream(dest)).on('close', function () {
      defered.resolve(dest);
    });
  });
  return defered.promise;
};

var getDataUrl = function (path) {
  var deferred = Q.defer();
  var fileReader = new FileReader();
  fileReader.readAsDataURL(new File(path));

  fileReader.on('data', function (data) {
  });

  // `onload` as listener
  fileReader.addEventListener('load', function (e) {
    deferred.resolve(e.target.result);
  });

  fileReader.addEventListener('loadend',function (e) {

  });
  return deferred.promise;
}

var loadImage = function (sources) {
  var defered = Q.defer();
  var image = new Image;
  image.dataMode = Image.MODE_MIME | Image.MODE_IMAGE;
  image.onload = function() {
    defered.resolve(image);
  };
  image.src = sources;
  return defered.promise;
};

var saveAsPDF = function(destination, canvas) {
  var defered = Q.defer();
  fs.writeFile(destination, canvas.toBuffer(), function(err) {
    defered.resolve(true);
  });
  return defered.promise;
};

var url = 'http://mylumin.com:3000/images/bg_intro.jpg';

download(url, imgdest)
  .then(function (result) {
    getDataUrl(result)
      .then(function (data) {
        loadImage(data)
          .then(function (image) {
            context.drawImage(image, 100, 100);
            saveAsPDF(dest, canvas)
              .then(function () {
                console.log('done');
              });
          });
      })
  })