/**
 * Book.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    books: {type: 'json'},
    total: {type: 'number'},
    owner:{
      model:'user'
    }
  },

  customToJSON: function () {
    return _.omit(this, ['binBook']);
  },
};
