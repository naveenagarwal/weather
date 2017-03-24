/*
 This is an abstract class which can be used to plugin any client
 client should define the fucntions defined here "weather.prototype.*"

 Options will be object with following keys
 options.client which client to use
 */
var Weather = function (options){
  this.client = new options.client;
};


/*
 For the functions defined below
 If thwere occurs any error in API call then it should invoke callback with
 following data
 {
 error: true,
 message: "Error Message",
 status: status code // 500, 422 404 etc
 }

 Options will be object with following keys
 options.location location for which weather information will be fetched
 callback to execute once weather information is fetchedf from the api.
 */
Weather.prototype.fetchWeatherByLocation = function(options, callback){
  this.client.fetchWeatherByLocation(options, callback);
}

/*
 Options will be object with following keys
 options.location location for which weather information will be fetched
 callback to execute once weather information is fetchedf from the api.
 */
Weather.prototype.fetchWeatherForCurrentDay = function(options, callback){
  this.client.fetchWeatherForCurrentDay(options, callback);
}

/*
 Options will be object with following keys
 options.location location for which weather information will be fetched
 callback to execute once weather information is fetched from the api.
 */
Weather.prototype.fetchWeatherByDay = function(options, callback){
  this.client.fetchWeatherByDay(options, callback);
}

module.exports = Weather;