/**
 * Book.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {type: 'string', required: true},
    author: {type: 'string', required: true},
    price: {type: 'number', required: true},
    keywords: {type: 'json'},
    binBook: {type: 'ref', columnType: 'binData'},
    active: {type: 'boolean', defaultsTo: true}

  },

  customToJSON: function () {
    return _.omit(this, ['binBook']);
  },
};
