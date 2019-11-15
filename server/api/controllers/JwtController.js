var bcrypt = require('bcryptjs');

module.exports = {
  /**
   * Controller action called when authenticating a user
   */
  auth: function (req, res) {
    var findCriteria = {};

    if (!req.body.email || !req.body.password) {
      return res.badRequest('Email or password not found');
    }

    findCriteria['email'] = req.body.email;

    //find email matching user
    User.findOne(findCriteria).then((user) => {
      if (!user) {
        return res.badRequest('User not found');
      }

      //validate password (password, callback)
      User.isPasswordValid(req.body.password, user.password, (err, match) => {
        if (err) {
          return res.badRequest(err);
        }
        if (match) {//issue a token to the user
          JwtService.issueToken({userId: user.id, userAccountType: user.accountType}, user).then((token) => {
            return res.json({user: user, token: token});
          }).catch((err) => {
            return res.badRequest(err);
          });

        } else {
          return res.badRequest('Invalid password');
        }
      });
    }).catch((err) => {
      return res.badRequest(err);
    });
  },


  /**
   * Controller action called when signing up
   */
  signup: function (req, res) {
    JwtService.createUser(req.body).then(user => {
      JwtService.issueToken({userId: user.id, userAccountType: user.accountType}, user).then((token) => {
        return res.json({user: user, token: token});
      }).catch((err) => {
        return res.badRequest(err);
      });
    }).catch(err => {
      return res.badRequest(err);
    });
  },

  me: function (req, res) {
    JwtService.issueToken({userId: req.user.id, userAccountType: req.user.accountType}, req.user).then((token) => {
      return res.json({user: req.user, token: token});
    }).catch((err) => {
      return res.badRequest(err);
    });
  }
};
