// Generated by CoffeeScript 1.4.0
var Facebook, rest;

rest = require('restler');

Facebook = rest.service(function() {
  return console.log("facebook rest started");
}, {
  baseURL: 'https://graph.facebook.com'
}, {
  get: function(get_token) {
    return this.get(get_token);
  }
});

exports.get = function(get_token, callback) {
  return rest.get("https://graph.facebook.com" + get_token, {
    parser: rest.parsers.json
  }).on('complete', function(result) {
    console.log(result);
    return callback(null, result);
  });
};
