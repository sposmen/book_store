/**
 * BookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const mongodb = require('mongodb');
const fs = require('fs');

module.exports = {

  create: function (req, res) {
    req.file('bookFile').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000
    }, (err, uploadedFiles) => {
      let book = _.pick(req.allParams(), ['name', 'author', 'price']);
      if (err) {
        return res.serverError(err);
      }

      // If no files were uploaded, respond with an error.
      if (uploadedFiles.length === 0) {
        return res.badRequest('No file was uploaded');
      }
      let filename = uploadedFiles[0].filename;

      let ext = filename.length > 3 && filename.substr(filename.length - 3).toLowerCase();

      if (uploadedFiles[0].type !== 'text/plain' && ext === 'txt') {
        return res.badRequest('Wrong file type. Only txt accepted');
      }

      fs.readFile(uploadedFiles[0].fd, (err, data) => {
        if (err) {
          return res.serverError(err);
        }
        book.binBook = new mongodb.Binary(data);

        Book.create(book).fetch().then((book) => {
          fs.unlink(uploadedFiles[0].fd, () => {
          });
          return res.json(book);
        }).catch((err) => {
          return res.badRequest(err);
        });
      });
    });
  },

  download: function (req, res) {
    Book.findOne({id: req.param('id')}).then((book) => {
      res.set({
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${book.name}.txt"`
      });
      res.send(book.binBook);
    });
  }
};

