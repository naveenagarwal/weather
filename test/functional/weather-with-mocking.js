var expect    = require('chai').expect;
var request = require('request');
var nock = require('nock');
var dummyJSON = require('../data/dummy-json')["darksky"];

describe('Weather App with mocking', function() {

  beforeEach(function(){
    api =nock('https://api.darksky.net')
    .get(function(uri) {
      return true;
    })
    .reply(200, dummyJSON);
  });

  afterEach(function(){
    nock.cleanAll()
  });

  var url = 'http://localhost:8080/';

  describe('visit weather page with mocking', function() {

    // supported url format for weather page
    // http://localhost:3000/weather/:location
    // http://localhost:3000/weather/:location/today
    // http://localhost:3000/weather/:location/:weekday


    // http://localhost:3000/weather/:location
    it('should return 200 page and weather information if location is existing with mocking', function(done) {
      var weatherURL =  url + "weather/goa";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.include('Current Temperature');
        done();
      });
    });

    // http://localhost:3000/weather/:location/today
    it('should return current day weather with mocking', function(done) {
      var weatherURL =  url + "weather/goa/today";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.include('Max Temperature');
        expect(body).to.include('Min Temperature');
        done();
      });
    });

    // http://localhost:3000/weather/:location/weekday
    // Allowed weedays - weekdays = [ "monday", "tuesday", "wednesday",
    // "thursday", "friday", "saturday", "sunday"]
    it('should return the weekday day weather with mocking', function(done) {
      var weatherURL =  url + "weather/goa/saturday";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.include('Max Temperature');
        expect(body).to.include('Min Temperature');
        done();
      });
    });

  });

  describe('visit weather page requesting json format with mocking', function() {

    // supported url format for weather page
    // http://localhost:3000/weather/:location?format=json
    // http://localhost:3000/weather/:location/todayformat=json
    // http://localhost:3000/weather/:location/:weekdayformat=json


    // http://localhost:3000/weather/:location
    it('should return 200 page and weather information if location is existing in json format with mocking', function(done) {
      var weatherURL =  url + "weather/goa?format=json";
      request.get(weatherURL, function(error, response, body) {
        body = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(body.currently).to.not.equal(undefined)
        done();
      });
    });

    // http://localhost:3000/weather/:location/weekday
    // Allowed weedays - weekdays = [ "monday", "tuesday", "wednesday",
    // "thursday", "friday", "saturday", "sunday"]
    it('should return the weekday day weather in json format with mocking', function(done) {
      var weatherURL =  url + "weather/goa/saturday?format=json";
      request.get(weatherURL, function(error, response, body) {
        body = JSON.parse(body);
        expect(body.daily.data.length).to.be.greaterThan(1);
        done();
      });
    });


  });


});