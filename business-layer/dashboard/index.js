// Generated by CoffeeScript 1.4.0

module.exports = function(req, res, callback) {
  var action, error;
  if (req.method === "GET") {
    action = req.params.action || "index";
    switch (action.toString().toLowerCase()) {
      case "index":
        return callback(null, "app/dashboard");
      default:
        error = new Error('Action not found: ' + action.toString().toLowerCase());
        error.http_code = 400;
        return callback(error);
    }
  } else if (req.method === "POST") {
    if (req.params.action != null) {
      switch (req.params.action.toString().toLowerCase()) {
        case "something":
          break;
        default:
          error = new Error('Action not found: ' + req.params.action.toString().toLowerCase());
          error.http_code = 400;
          return callback(error);
      }
    } else {
      error = new Error('Action is mandatory for POST requests');
      error.http_code = 400;
      return callback(error);
    }
  } else {
    error = new Error('Method is not allowed');
    error.http_code = 405;
    return callback(error);
  }
};
