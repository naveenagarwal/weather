const expect    = require('chai').expect;
const nock = require('nock');
const app = require('../../app');

const fixtures = require('../fixtures/dummy-json');
const fixturesDarksky = fixtures["darksky"];
const fixturesGeocoder = fixtures["geocoder"];

const request = require('supertest')(app);

var status = 'OK';

describe('Weather App with mocking', function() {


    beforeEach(function(){
      nock('https://api.darksky.net')
      .get(function() {
        return true;
      })
      .reply(200, fixturesDarksky);

        nock('https://maps.googleapis.com')
        .get(function(url) {
            var location = escape("this location is not available");
            var regex = new RegExp(location);
            if (regex.test(url)) {
                status = "Error";
            }else {
                status = 'OK';
            }
            return true;
        })
        .reply(200, function () {
            return { results: fixturesGeocoder, status: status };
        });
    });

    afterEach(function(){
      nock.cleanAll();
    });


  describe('visit home page', function() {
    it('should have the content of home page', function(done) {
      var url = '/';
      request.get(url)
      .expect(200)
      .end(function(error, response) {
        expect(response.text).to.include('Welcome to Weather App, Search for a location to get the weather information');
        done();
      });
    });
  });


  describe('visit weather page with mocking', function() {

    // supported url format for weather page
    // http://localhost:3000/weather/:location
    // http://localhost:3000/weather/:location/today
    // http://localhost:3000/weather/:location/:weekday
    // http://localhost:3000/weather/:location

    it('should return 200 page and weather information if location is existing with mocking', function(done) {
      var weatherURL =  "/weather/goa";
      request.get(weatherURL)
      .expect(200)
      .end(function(error, response) {
        expect(response.text).to.include('Current Temperature');
        done();
      });
    });

    // http://localhost:3000/weather/:location/today
    it('should return current day weather with mocking', function(done) {
      var weatherURL =  "/weather/goa/today";
      request.get(weatherURL)
      .expect(200)
      .end(function(error, response) {
        expect(response.text).to.include('Max Temperature');
        expect(response.text).to.include('Min Temperature');
        done();
      });
    });

    // http://localhost:3000/weather/:location/weekday
    // Allowed weedays - weekdays = [ "monday", "tuesday", "wednesday",
    // "thursday", "friday", "saturday", "sunday"]
    it('should return the weekday day weather with mocking', function(done) {
      var weatherURL =  "/weather/goa/saturday";
      request.get(weatherURL)
      .expect(200)
      .end(function(error, response) {
        expect(response.text).to.include('Max Temperature');
        expect(response.text).to.include('Min Temperature');
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
      var weatherURL =  "/weather/goa?format=json";
      request.get(weatherURL)
      .expect(200)
      .end(function(error, response) {
        text = JSON.parse(response.text);
        expect(text.currently).to.be.deep.equal(fixturesDarksky.currently);
        done();
      });
    });

    // http://localhost:3000/weather/:location/weekday
    // Allowed weekdays - weekdays = [ "monday", "tuesday", "wednesday",
    // "thursday", "friday", "saturday", "sunday"]
    it('should return the weekday day weather in json format with mocking', function(done) {
      var weatherURL =  "/weather/goa/saturday?format=json";
      request.get(weatherURL)
      .expect(200)
      .end(function(error, response) {
        text = JSON.parse(response.text);
        expect(text.daily.data).to.be.deep.equal(fixturesDarksky.daily.data);
        done();
      });
    });


  });


});