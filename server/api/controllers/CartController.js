module.exports = {
  find: async function (req, res) {
    let cart = await Cart.findOrCreate(
      {owner: req.user.id},
      {owner: req.user.id, books: []}
    );
    return res.json(await Book.find({id: cart.books}));
  },

  create: async function (req, res) {
    let book = await Book.findOne({id: req.param('bookId')});
    if (!book) {
      return res.badRequest('Book doesn\'t exist');
    }
    Cart.findOrCreate({owner: req.user.id}, {owner: req.user.id, books: []}).then(async (cart) => {
      let books = cart.books;
      if (books.indexOf(book.id) < 0) {
        books.push(book.id);
      }
      await Cart.updateOne({id: cart.id}).set({
        books: books
      });
      return await Book.find({id: books});
    }).then(books => {
      return res.json(books);
    })
    .catch(err => res.badRequest(err.message));
  }
};
