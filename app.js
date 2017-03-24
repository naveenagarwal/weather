var express = require('express');
var path = require('path');
var logger = require('morgan');

var middleWares = require('./middleware/middleware');

var index = require('./routes/index');
var weather = require('./routes/weather');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

/*
 middleware to tell the format of the request
 code currently caters json and html format only
 */
app.use(function(req, res, next){
  middleWares.checkValidRequestFormat(req, res, next);
});

app.use('/', index);
app.use('/weather', weather);



// middleware catch 404 and forward to error handler
app.use(function(req, res, next){
  middleWares.handlePageNotFound(req, res, next);
});
// middleware error handler
app.use(function(err, req, res, next){
  middleWares.errorHandler(err, req, res, next);
});

module.exports = app;
