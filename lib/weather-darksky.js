var https = require('https');
var NodeGeocoder = require('node-geocoder');
var config = require('../config/config');

// Options prepared to get the lat, lan from node geocoder
// options used are as it is from the module readme on github
var NodeGeocoderOptions = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey:  config.keys.GEOCODER_GOOGLE_API,
  formatter: null
};

var WeatherDarksky = function(){
  this.key = config.keys.DARSKY_API;
  this.url = 'api.darksky.net';

  // default options prepared to make an API call
  this.getDefaultOptions = function(options){
    return {
      host: this.url,
      port: 443,
      path: '/forecast/' + this.key + '/' + options.latitudeLongitudeTime +
        '?exclude=hourly,minutely,flags',
      method: 'Get'
    };
  };

  // the sequence of this array matters as we use it to calculate the next
  // number of days in future
  this.weekdays = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  ]
};

// Options will be object with following keys
// options.location location for which weather information will be fetched.
// options.days it is passed to the callback for displaying the weather
//    information till number of days.
// options.time to fetch the weather information for aparticlur day
// callback to execute once weather information is fetchedf from the api.
// Optionally we can make this method function as well
WeatherDarksky.prototype.getWeatherInformation = function(options, callback){
  if(!options || !options.location){
    return -1;
  }
  var that = this;
  var geocoder = NodeGeocoder(NodeGeocoderOptions);
  geocoder.geocode(options.location).then(function(result) {
    var firstLocationMatched = result[0];
    if(firstLocationMatched === undefined){
      throw "Could not get the location";
      return;
    }
    options.latitudeLongitudeTime = firstLocationMatched.latitude.toString() +
      ',' + firstLocationMatched.longitude

    if(options.time){
      options.latitudeLongitudeTime += ',' + options.time.toString();
    }else {
      options.time = '';
    }

    var getOptions = that.getDefaultOptions(options);

    var request = https.request(getOptions, function(apiResponse){
      apiResponse.on('data', function(weatherData) {
        if(options.days){
          callback.call(weatherData, options.days);
        }else{
          callback.call(weatherData);
        }

      });
    });

    request.end();

    request.on('error', function(e) {
      callback.call({
        error: true,
        message: 'Could not find the information from API',
        status: 422
      });
    });

  }).catch(function(e) {
    callback.call({
      error: true,
      message: 'Could not find the location from geocoder',
      status: 422
    });
  });
};

// fetch the weather informaton for a location
WeatherDarksky.prototype.fetchWeatherByLocation = function(options, callback){
  var weather = new WeatherDarksky();
  weather.getWeatherInformation(options, callback);
};

// fetch the weather information for current day
WeatherDarksky.prototype.fetchWeatherForCurrentDay = function(options, callback){
  var weather = new WeatherDarksky()

  // Unix time stamp for current dtae and time.
  options.time = Math.round(+new Date()/1000);
  weather.getWeatherInformation(options, callback);
}

// fetch the weather information by the day in future upto one week.
WeatherDarksky.prototype.fetchWeatherByDay = function(options, callback){
  var weather = new WeatherDarksky(),
    date = new Date();

  // It is formula to get the number of days from current weekday to next weekday
  if(this.weekdays.indexOf(options.weekday) == -1){
    callback.call({error: true, message: 'Invalid request', status: 422});
    return;
  }else{
    var days = this.weekdays.indexOf(options.weekday) + 1 - date.getDay();
    if(days < 1){
      days += 7;
    }

    options.days = days;
    weather.getWeatherInformation(options, callback);
  }

}


module.exports = WeatherDarksky;