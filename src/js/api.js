const CONFIGURATION = require('./configuration.js');
let request = require('request');
let url = require('url');
let _ = require('lodash');
let Bacon = require('baconjs');
let queryString = require('querystring');

module.exports.get = function(options_){
  return Bacon.fromBinder(sink => {
    let isObj = typeof options_ === "string";
    let options = constructOptions(options_);

    request(options, options.data, (err, response, body) => {
      sink(receive(err, response, body));
      sink(new Bacon.End());
    });

    return () => {};
  }).toProperty();
};

module.exports.post = options_ => {
  return Bacon.fromBinder(sink => {
    let options = constructOptions(options_);
    request.post(options, (err, response, body) => {
      sink(receive(err, response, body));
      sink(new Bacon.End());
    });

    return () => {};
  }).toProperty();
};

function receive(err, response, body){
  if(err){
    return new Bacon.Error(err);
  } else{
    try{
      return body;
    }catch(e){
      return new Bacon.Error(e);
    }
  }
}

function constructOptions(options_){
  let options;
  if(typeof options_ === "string"){
    options = {
      method: 'GET',
      url: CONFIGURATION.API + options_,
      json: true
    };
  } else{
    options = _.extend({}, options_, {
      uri: CONFIGURATION.API + options_.endpoint,
      form: options_.data,
    });
  }

  return options;
}
