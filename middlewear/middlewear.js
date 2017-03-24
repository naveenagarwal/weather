var config = require('../config/config');

var middleWears = {
  checkValidRequestFormat: function(req, res, next){
    var format = req.query.format || "html";
    if(config.supportedRequestFormats.indexOf(format) > -1 ){
      if(format === "json"){
        req.headers.accept = 'application/' + format;
      }else if(format === "html"){
        req.headers.accept = 'text/' + format;
      }
      next();
    }else{
      console.log("Invalid request, unsupported format")
      res.status(422);
      res.send("Invalid request, unsupported format");
    }
  },

  handlePageNotFound: function(req, res, next){
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  },

  errorHandler: function(err, req, res, next){
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
  }
};

module.exports = middleWears;