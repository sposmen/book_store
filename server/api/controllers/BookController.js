/**
 * BookController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const mongodb = require('mongodb');
const fs = require('fs');

module.exports = {

  create: async function (req, res) {
    let book = req.allParams();

    let booksCount = await Book.count(_.pick(book, ['name', 'author']));

    if(booksCount>0){
      return res.badRequest('Book already exist');
    }

    req.file('bookFile').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000
    }, (err, uploadedFiles) => {
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

      let streamer = fs.createReadStream(uploadedFiles[0].fd);

      new WordCounter((err, wc) => {
        if (err) {
          return res.serverError(err);
        }

        let sizeKeysValues = [...wc.sizeKeys.keys()];

        let keysIterator = sizeKeysValues.pop();
        let keywords = [];
        while (keysIterator && keywords.length < 5) {
          let words = [...wc.sizeKeys.get(keysIterator).keys()];
          keywords = _.flatten([keywords, words]);
          keysIterator = sizeKeysValues.pop();
        }

        keywords.length = 5;
        book.keywords = keywords;
        book.binBook = new mongodb.Binary(wc.data);

        Book.create(book).fetch().then((book) => {
          fs.unlink(uploadedFiles[0].fd, () => 1);
          return res.json(book);
        }).catch((err) => {
          return res.badRequest(err.message);
        });
      }).run(streamer);
    });
  },

  count: async function (req, res) {
    res.send(await Book.count());
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

