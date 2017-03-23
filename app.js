var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var middleWears = require('./middlewear/middlewear');

var index = require('./routes/index');
var weather = require('./routes/weather');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// middlewear to tell the format of the request
// code currently caters json and html format only
app.use(function(req, res, next){
  middleWears.checkValidRequestFormat(req, res, next);
});

app.use('/', index);
app.use('/weather', weather);



// middlewear catch 404 and forward to error handler
app.use(function(req, res, next){
  middleWears.handlePageNotFound(req, res, next);
});
// middlewear error handler
app.use(function(err, req, res, next){
  middleWears.errorHandler(err, req, res, next);
});

module.exports = app;
