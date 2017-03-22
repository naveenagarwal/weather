process.env.NODE_ENV = 'test';
process.env.PORT = 8080;

var expect    = require('chai').expect;
var request = require('request');
var app = require("../../app");


describe('Weather App', function() {
  before(function () {
    app.listen(process.env.PORT);
  });

  after(function () {
    process.exit();
  });

  var url = 'http://localhost:8080/';

  describe('visit home page', function() {
    it('should should have the contect of home page', function(done) {
      request.get(url, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.include('Welcome to Weather App, Search for a location to get the weather information');
        done();
      });
    });
  });

  describe('visit weather page', function() {

    // supported url format for weather page
    // http://localhost:3000/weather/:location
    // http://localhost:3000/weather/:location/today
    // http://localhost:3000/weather/:location/:weekday

    it('should return 404 status if location is empty in url', function(done) {
      var weatherURL =  url + "weather";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(404);
        done();
      });
    });

    // http://localhost:3000/weather/:location
    it('should return 422 page if location is non existing', function(done) {
      var weatherURL =  url + "weather/nkownLocationOnEarthWhichGoogleCanntFind";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(422);
        done();
      });
    });

    // http://localhost:3000/weather/:location
    it('should return 200 page and weather information if location is existing', function(done) {
      var weatherURL =  url + "weather/goa";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.include('Current Temprature');
        done();
      });
    });

    // http://localhost:3000/weather/:location/today
    it('should return current day weather', function(done) {
      var weatherURL =  url + "weather/goa/today";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.include('Max Temprature');
        expect(body).to.include('Min Temprature');
        done();
      });
    });

    // http://localhost:3000/weather/:location/weekday
    // Allowed weedays - weekdays = [ "monday", "tuesday", "wednesday",
    // "thursday", "friday", "saturday", "sunday"]
    it('should return the weekday day weather', function(done) {
      var weatherURL =  url + "weather/goa/saturday";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(200);
        expect(body).to.include('Max Temprature');
        expect(body).to.include('Min Temprature');
        done();
      });
    });

    // http://localhost:3000/weather/:location/weekday
    it('should return 422 for invalid weekday day weather', function(done) {
      var weatherURL =  url + "weather/goa/somedayInAWeek";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(422);
        expect(body).to.include('Invalid request');
        done();
      });
    });
  });

  describe('visit weather page requesting json format', function() {

    // supported url format for weather page
    // http://localhost:3000/weather/:location?format=json
    // http://localhost:3000/weather/:location/todayformat=json
    // http://localhost:3000/weather/:location/:weekdayformat=json

    // http://localhost:3000/weather/:location
    it('should return 422 page if location is non existing in json format', function(done) {
      var weatherURL =  url + "weather/nkownLocationOnEarthWhichGoogleCanntFind?format=json";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(422);
        done();
      });
    });

    // http://localhost:3000/weather/:location
    it('should return 200 page and weather information if location is existing in json format', function(done) {
      var weatherURL =  url + "weather/goa?format=json";
      request.get(weatherURL, function(error, response, body) {
        body = JSON.parse(body);
        expect(response.statusCode).to.equal(200);
        expect(body.currently).to.not.equal(undefined)
        done();
      });
    });

    // http://localhost:3000/weather/:location/today
    it('should return current day weather in json format', function(done) {
      var weatherURL =  url + "weather/goa/today?format=json";
      request.get(weatherURL, function(error, response, body) {
        body = JSON.parse(body);
        expect(body.daily.data).to.have.length(1);
        done();
      });
    });

    // http://localhost:3000/weather/:location/weekday
    // Allowed weedays - weekdays = [ "monday", "tuesday", "wednesday",
    // "thursday", "friday", "saturday", "sunday"]
    it('should return the weekday day weather in json format', function(done) {
      var weatherURL =  url + "weather/goa/saturday?format=json";
      request.get(weatherURL, function(error, response, body) {
        body = JSON.parse(body);
        expect(body.daily.data.length).to.be.greaterThan(1);
        done();
      });
    });

    // http://localhost:3000/weather/:location/weekday
    it('should return 422 for invalid weekday day weather in json format', function(done) {
      var weatherURL =  url + "weather/goa/somedayInAWeek?format=json";
      request.get(weatherURL, function(error, response, body) {
        expect(response.statusCode).to.equal(422);
        done();
      });
    });
  });

  describe('visit weather page with unsupported format', function() {
      // http://localhost:3000/weather/:location
      it('should return 200 page and weather information if location is existing in unsupported format', function(done) {
        var weatherURL =  url + "weather/goa?format=unsupported";
        request.get(weatherURL, function(error, response, body) {
          expect(response.statusCode).to.equal(422);
          expect(body).to.equal("Invalid request, unsupported format")
          done();
        });
      });
  });

});