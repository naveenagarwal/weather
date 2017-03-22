var config = {};

// by default we assume it is a development environment
var environment = process.env.NODE_ENV || 'development';

if(environment === 'development'){
  config = require('./environment/development');
}else if (environment === 'test'){
  config = require('./environment/test');
} else if(environment === 'production'){
  config = require('./environment/production');
}

module.exports = config;