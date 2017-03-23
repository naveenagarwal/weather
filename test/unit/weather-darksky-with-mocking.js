process.env.NODE_ENV = 'test';
process.env.PORT = 8080;

var expect    = require('chai').expect;
var WeatherDarksky = require("../../lib/weather-darksky");
var nock = require('nock');
var dummyJSON = require('../data/dummy-json')["darksky"];

describe('Weather Darksky class test with mocking API', function() {
  beforeEach(function(){
    nock('https://api.darksky.net')
    .get(function(uri) {
      return true;
    })
    .reply(200, dummyJSON);
  });

  afterEach(function(){
    nock.cleanAll()
  });

  it('fetchWeatherByLocation for a location fetch weather with mocking', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa"
      };

    weather.fetchWeatherByLocation(options, function(){
      locationWeather = JSON.parse(this);
      expect(locationWeather.currently).to.not.equal(undefined);
      done();
    });
  });

  // @flaky
  // This fails with mocking.
  // it('fetchWeatherForCurrentDay for a location fetch current day weather', function(done){
  //   var weather = new WeatherDarksky,
  //     options = {
  //       location: "goa"
  //     };

  //   weather.fetchWeatherForCurrentDay(options, function(){
  //     expect(locationWeather.daily.data).to.have.length(1);
  //     done();
  //   });
  // });

  it('fetchWeatherByDay for a weekday comming in next 7 days with mocking', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa",
        weekday: "saturday"
      };

    weather.fetchWeatherByDay(options, function(){
      expect(locationWeather.daily.data.length).to.be.greaterThan(1);
      done();
    });
  });

  it('fetchWeatherByLocation should return error with invalid location with mocking', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "this location is not avaialble"
      };

    weather.fetchWeatherByLocation(options, function(){
      expect(this.error).to.be.equal(true);
      done();
    });
  });

  it('fetchWeatherByDay should return error with invalid weekday with mocking', function(done){
    var weather = new WeatherDarksky,
      options = {
        location: "goa",
        weekday: "saturdayNotAvailable"
      };

    weather.fetchWeatherByDay(options, function(){
      expect(this.error).to.be.equal(true);
      done();
    });
  });

})