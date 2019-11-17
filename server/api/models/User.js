/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const bcrypt = require('bcryptjs');

module.exports = {

  attributes: {
    name: {type: 'string', required: true},
    email: {type: 'string', required: true, unique: true},
    password: {type: 'string', required: true, minLength: 6},
    accountType: {type: 'string', defaultsTo: 'user'},
    active: {type: 'boolean', defaultsTo: true},
    token: {type: 'string', defaultsTo: 'token'},

    orders: {
      collection: 'order',
      via: 'owner'
    },
    cart: {
      collection: 'cart',
      via: 'owner'
    }
  },

  // Override toJSON method to remove password from API
  customToJSON: function () {
    return _.omit(this, ['password']);
  },

  isPasswordValid: function (password, u_password, cb) {
    bcrypt.compare(password, u_password, cb);
  },

  beforeCreate: function (values, cb) {
    // Hash password
    bcrypt.hash(values.password, 10, (err, hash) => {
      if (err) {
        return cb(err);
      }
      values.password = hash;
      //calling cb() with an argument returns an error. Useful for canceling the entire operation if some criteria fails.
      cb();
    });
  }
};
