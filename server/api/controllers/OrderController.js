module.exports = {

  count: async function (req, res) {
    res.send(await Order.count());
  },

  create: async function (req, res) {
    let cart = await Cart.findOne({owner: req.user.id}).populate(['books']);
    if (!cart || !_.isArray(cart.books) || cart.books.length === 0) {
      res.badRequest('Cart is empty');
    }
    let total = 0;
    let books = cart.books.map(book => {
      total += book.price;
      return {
        id: book.id,
        name: book.name,
        price: book.price
      };
    });

    Order.create({
      owner: req.user.id,
      books: books,
      total: total
    }).fetch()
    .then(newOrder => {
      res.json(newOrder);
    }).catch(err => res.badRequest(err.message));
  }
};
