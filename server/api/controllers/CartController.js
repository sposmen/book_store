module.exports = {
  find: async function (req, res) {
    let cart = await Cart.findOrCreate(
      {owner: req.user.id},
      {owner: req.user.id, books: []}
    );
    return res.json(await Book.find({id: cart.books, active: true}));
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
  },

  placeOrder: async function (req, res) {
    let cart = await Cart.findOne({owner: req.user.id});
    if (!cart) {
      return res.badRequest('No books in cart');
    }

    let books = await Book.find({id: cart.books, active: true});
    if (!books) {
      return res.badRequest('No books in cart');
    };

    books = books.map(book => {
      return {
        id: book.id,
        name: book.name,
        price: book.price
      };
    });

    let total = books.reduce((acc, book) => {
      return acc + book.price;
    }, 0);

    let newOrder = {
      owner: req.user.id,
      books: books,
      total: total
    };

    let placedOrder = await Order.create(newOrder).fetch();

    if (placedOrder) {
      await Cart.updateOne({id: cart.id}).set({
        books: []
      });
    }

    return res.json(placedOrder);
  }
};
