var ObjectId = require('mongodb').ObjectId
var User = require('../models/user');

function loggedOut(req, res, next) {
  if (req.session && req.session.userId) {
    return res.redirect('/profile');
  } else {
    return next();
  }
}

function requiresLogin(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  } else {
    var err = new Error('You meowst be logged in to see this page...');
    err.status = 401;
    return next(err);
  }
}

function isAdmin(req, res, next) {
  var id = ObjectId(req.session.userId);
  User.findById(id)
          .exec(function (err, user) {
            if (err) {
              return next(err);
            } else {
              if (user.type) {
                return next();
              } else {
                var err = new Error('You meowst be an admin to see this page...');
                err.status = 401;
                return next(err);
              }
            }
          })
}

module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;
module.exports.isAdmin = isAdmin;
