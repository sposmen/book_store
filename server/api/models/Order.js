/**
 * Book.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    books: {
      collection: 'book',
      via: 'orders'
    },
    owner:{
      model:'user'
    }
  },

  customToJSON: function () {
    return _.omit(this, ['binBook']);
  },
};
