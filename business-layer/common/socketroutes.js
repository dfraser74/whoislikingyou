// Generated by CoffeeScript 1.4.0
var connect, cookie_module;

cookie_module = require('express/node_modules/cookie');

connect = require('express/node_modules/connect');

module.exports = function(app, myAuthentication, io, session_store, events) {
  io.configure(function() {
    return io.set('authorization', function(data, accept) {
      var cookie, cookieID;
      if (data.headers.cookie) {
        cookie = cookie_module.parse(data.headers.cookie);
        cookie = connect.utils.parseSignedCookies(cookie, 'whoislikingyou');
        cookieID = cookie['sid'];
        return session_store.get(cookieID, function(err, session) {
          if (err || !session) {
            return accept(null, false);
          } else {
            if (session.passport.user != null) {
              data.session = session;
              data.sessionID = cookieID;
              return accept(null, true);
            } else {
              return accept(null, false);
            }
          }
        });
      } else {
        console.log("no cookie");
        return accept(null, false);
      }
    });
  });
  return io.sockets.on('connection', function(socket) {
    var sessionID;
    socket.on("activatepage", function(data) {
      var business_object;
      business_object = require("../dashboard/sockets");
      return business_object.activatePage(data);
    });
    socket.on('disconnect', function() {
      if ((socket != null ? socket.handshake : void 0) != null) {
        if (socket.handshake != null) {
          return delete socket.handshake.session;
        }
      }
    });
    if (socket.handshake != null) {
      sessionID = socket.handshake.sessionID;
      return console.log("Connected", sessionID);
    }
  });
};
