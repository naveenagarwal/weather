const express = require('express');
const path = require('path');
const logger = require('morgan');

const middleWares = require('./middleware/middleware');

const index = require('./routes/index');
const weather = require('./routes/weather');

const app = express();

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
