# weather
This is a weather app to tell you the weather forecast.

# Used framework
Express js

Application is structured using **express-generator**
View engine used is **pug**

Mocha is used for unit and functional testing.
Functional test are present in test/functional
Unit test are present in test/unit.

**Nock is used to mock the darksky api.**

To run the test suite

`npm install`

`npm test`

node-geocoder module used to fetch the location latitude, longitude using google as provider.
GitHub https://github.com/nchaulet/node-geocoder

Application responds to both **HTM**L and **JSON** format of request.

# HTML Format
http://localhost:3000/ #Homepage

http://localhost:3000/weather/:location # current weather information by location

http://localhost:3000/weather/:location/today # current date weather information by location

http://localhost:3000/weather/:location/:weekday # weather information upto next weekday occuring in future

# JSON Format

http://localhost:3000/weather/:location?format=json

http://localhost:3000/weather/:location/today?format=json

http://localhost:3000/weather/:location/:weekday?format=json

**Note** - In json format app returns everything which it gets from the darksky api. And Weather information can only be retrived for a location if it can fetch the latitude longitude values from google geocoder api.

To run the application, git clone it. Move to the cloned directory and run

`npm install`

`npm start` // then visit http://localhost:3000 in your browser`

# Config files
Application environment files are used to hold the applcation config variables and settings.
currently it has geocoder api and darksky api for all the environments.

**To change the api keys for geocoder or darksky api, change the values in config/environment/development.js file or dependign on the environment you are ruinng the application.**

# lib Directory
It has weather.js class which uses dependency injection and expects client class reference as parameter when initialized,
and weather-darksky.js client specific class which implements the client specific behaviour to make request to the weather api.

# middleware Directory
It contains all the middleware generic middleware used in the app.

Middleware used

1. checkValidRequestFormat // It check if request is in valid format. i.e. html or json
2. handlePageNotFound // It handle the 404 request
3. errorHandler // it handles the other error which  might occur in app



Rest is standard structure for a express node app.

#TODO

Separate the node-geocoder dependency from the darksky client.