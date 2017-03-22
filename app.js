var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./config/config');

var index = require('./routes/index');
var weather = require('./routes/weather');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// custom middlewear to tell the format of the request
// code currently caters json and html format only
app.use(function (req, res, next) {
  var format = req.query.format || "html";
  if(config.supportedRequestFormats.indexOf(format) > -1 ){
    if(format == "json"){
      req.headers.accept = 'application/' + format;
    }else if(format == "html"){
      req.headers.accept = 'text/' + format;
    }
    next();
  }else{
    console.log("Invalid request, unsupported format")
    res.status(422);
    res.send("Invalid request, unsupported format");
  }
});

app.use('/', index);
app.use('/weather', weather);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = (req.app.get('env') === 'development' ||
      req.app.get('env') === 'test') ? err : {};

  // render the error page
  res.status(err.status || 500);

  res.format({
    html: function(){
      // rendering error template
      res.render('error');
    },
    json: function(){
      // rendering local data of response set above
      res.send(res.locals);
    }
  });
});

module.exports = app;
