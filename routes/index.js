var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.format({
    html: function(){
      res.render('index');
    },
    json: function(){
      // rendering everything we got from API
      res.send({ message: "Welcome to weather app" });
    }
  });

});

module.exports = router;
