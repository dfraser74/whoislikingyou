// Generated by CoffeeScript 1.4.0

module.exports = function(req, res, callback) {
  var accessToken, facebookAPI, get_token, user, username;
  console.log("entering login");
  user = require("../../data-layer/collections/user");
  facebookAPI = require("../../data-layer/external-services/facebook");
  username = req.session.auth.facebook.user.username;
  accessToken = req.session.auth.facebook.accessToken;
  get_token = "/" + username + "/accounts&access_token=" + accessToken;
  return facebookAPI.get(get_token, function(err, obj) {
    if (err != null) {
      obj = {
        err: "unable to retreive pages"
      };
    }
    return user.upsert(req.session.auth.facebook, obj, function(err) {
      if (err != null) {
        return callback(err);
      }
      return callback(null);
    });
  });
};
