var CONFIGURATION = require('./configuration.js');
var request = require('request');
var url = require('url');
var _ = require('lodash');
var Bacon = require('baconjs');
var queryString = require('querystring');

module.exports.get = function(options_){
  return Bacon.fromBinder(function(sink){
    var isObj = typeof options_ === "string";
    var options = constructOptions(options_);

    request(options, function(err, response, body){
      sink(receive(err, response, body));
      sink(new Bacon.End());
    });

    return function(){};
  }).toProperty();
};

module.exports.send = function(options_){
  return Bacon.fromBinder(function(sink){
    var options = constructOptions(options_);
    request[options.method.toLowerCase()](options, function(err, response, body){
      sink(receive(err, response, body));
      sink(new Bacon.End());
    });

    return function(){};
  }).toProperty();
};

function receive(err, response, body){
  if(err){
    return new Bacon.Error(err);
  } else{
    try{
      return JSON.parse(body);
    }catch(e){
      return new Bacon.Error(e);
    }
  }
}

function constructOptions(options_){
  var options;
  if(typeof options_ === "string"){
    options = {
      method: 'GET',
      url: CONFIGURATION.API + options_
    };
  } else{
    options = _.extend({}, options_, {
      uri: CONFIGURATION.API + options_.endpoint
    });
  }

  if(options_.method === "GET" && options_.qs){
    options.qs = options_.qs;
  } else if(options_.method !== "GET" && options_.data){
    options.form = options_.data;
  }

  return options;
}
