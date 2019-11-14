const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Returns a promise when a payload is passed. if successful, promise contains a new token
 */
module.exports.issueToken = function (payload, user) {
  return new Promise((resolve, reject) => {
    jwt.verify(user.token, sails.config.jsonWebToken.tokenSecret, sails.config.jsonWebToken.options, function (err, decoded) {
      if (err || payload.passwordReset) {//if the stored token is invalid, or expired
        //request for a new one
        jwt.sign(payload, sails.config.jsonWebToken.tokenSecret, sails.config.jsonWebToken.options, function (err, token) {
          if (err) {
            reject(err);
          }
          User.update({id: user.id}, {token: token}).fetch().then(data => resolve(token)).catch(error => reject(error));
        });
      } else {//if its still valid and not expired
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
    jwt.verify(token, sails.config.jsonWebToken.tokenSecret, sails.config.jsonWebToken.options, function (err, decoded) {
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

    newUser['email'] = body.email;

    //user object
    newUser['name'] = body.name;
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

    User.findOne({email: email}).then(user => {

      JwtService.issueToken({user_id: user.id, email: email, passwordReset: true}, user).then(token => {
        //delete any existing token on that account
        User.update({email: email}, {token: ''}).fetch().then(data => {
        });
        resolve(token);
      }).catch(error => reject(error));

    }).catch(error => reject(error));

  });

};


module.exports.resetPassword = function (password, token) {

  return new Promise((resolve, reject) => {
    JwtService.verifyToken(token).then(payload => {

      if (payload.passwordReset) {
        // Hash password
        bcrypt.hash(password, 10, function (err, hash) {
          //if error hashing password
          if (err) {

            reject(err);

          } else {

            password = hash;
            User.update({id: payload.user_id, email: payload.email}, {password: password}).fetch().then(data => resolve(
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
