const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Returns a promise when a payload is passed. if successful, promise contains a new token
 */
module.exports.issueToken = function (payload, user) {
  return new Promise((resolve, reject) => {
    jwt.verify(user.token, sails.config.jsonWebToken.tokenSecret, sails.config.jsonWebToken.options, (err) => {
      if (err || payload.passwordReset) {//if the stored token is invalid, or expired
        //request for a new one
        jwt.sign(payload, sails.config.jsonWebToken.tokenSecret, sails.config.jsonWebToken.options, (err, token) => {
          if (err) {
            reject(err);
          }
          User.update({id: user.id}, {token: token}).fetch().then(() => resolve(token)).catch(error => reject(error));
        });
      } else {
        resolve(user.token);
      }
    });
  });
};


/**
 * Returns a promise after verifing the token passed to it. If successful promise contains decoded payload
 */
module.exports.verifyToken = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, sails.config.jsonWebToken.tokenSecret, sails.config.jsonWebToken.options, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};


/**
 * Creates a new user
 */
module.exports.createUser = function (body) {
  return new Promise((resolve, reject) => {
    var newUser = {};

    // Validate request paramaters
    if (!body.email || !body.password) {
      reject('email or password parameter(s) missing');
    }

    newUser['name'] = body.name;
    newUser['email'] = body.email;
    newUser['password'] = body.password;
    newUser['active'] = sails.config.jsonWebToken.defaultAccountStatus;

    if (body.accountType) {
      newUser['accountType'] = body.accountType;
    }

    User.create(newUser).fetch().then((user) => {
      resolve(user);
    }).catch((err) => {
      reject(err);
    });
  });
};


/**
 * Returns a promise with a token used for resetting a password
 */
module.exports.getPasswordResetToken = function (email) {
  return new Promise((resolve, reject) => {
    User.findOne({email: email})
    .then(user => {
      JwtService.issueToken({userId: user.id, email: email, passwordReset: true}, user)
      .then(token => {
        //delete any existing token on that account
        User.update({email: email}, {token: ''});
        resolve(token);
      })
      .catch(error => reject(error));
    }).catch(error => reject(error));
  });
};


module.exports.resetPassword = function (password, token) {

  return new Promise((resolve, reject) => {
    JwtService.verifyToken(token).then(payload => {
      if (payload.passwordReset) {
        // Hash password
        bcrypt.hash(password, 10, (err, hash) => {
          //if error hashing password
          if (err) {
            reject(err);
          } else {
            password = hash;
            User
            .update({id: payload.userId, email: payload.email}, {password: password})
            .fetch()
            .then(() => resolve(
              {message: 'password updated successfully for user ' + payload.email}
            ));
          }
        });
      } else {

        reject({
          message: 'Invalid token passed, please use the right token generated for this'
        });
      }
    }).catch(error => reject(error));
  });
};

module.exports.createPolicy = function (accountType = null) {
  return function (req, res, next) {
    let token;

    if (req.headers && req.headers.authorization) {
      let parts = req.headers.authorization.split(' ');
      //authorization: Bearer eyJhbGciOiJIUzI1NiIXVCJ9TJVA95OrM7E20RMHrHDcEfxjoYZgeFONFh7HgQ
      if (parts.length === 2) {
        let [scheme, credentials] = parts;

        if (/^Bearer$/i.test(scheme)) {//is scheme is Bearer
          token = credentials;
        } else {
          token = false;
        }
      } else {
        return res.status(401).json({
          err: {
            status: 'danger',
            message: 'wrong format in header. Check Authorization value'
          }
        });
      }
    } else if (req.param('token')) {
      token = req.param('token');
      // We delete the token from param to not mess with blueprints
      delete req.query.token;
    } else {
      return res.status(401).json({err: {status: 'danger', message: 'No authorization header found'}});
    }

    JwtService.verifyToken(token).then((decoded) => {
      //add user id to the request object
      let id = decoded.userId;
      if(!id){
        return res.status(400).json({
          err: {
            status: 'danger',
            message: accountType ?
              'User doesn\'t exist or this ACCOUNT-TYPE cannot access this route'
              : 'This account no longer exist or has been deleted'
          }
        });
      }
      User.findOne({id: id}).then(user => {
        if (user) {
          req.user = user;
          return next();
        } else {
          return res.status(400).json({
            err: {
              status: 'danger',
              message: accountType ?
                'User doesn\'t exist or this ACCOUNT-TYPE cannot access this route'
                : 'This account no longer exist or has been deleted'
            }
          });
        }
      }).catch(error => {
        return res.badRequest(error);
      });
    }).catch((error) => {
      return res.badRequest(error);
    });
  };
};
