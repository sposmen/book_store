import React from 'react';
import JwtRequest from '../services/JwtRequest';
import {Col, Row, Table} from 'react-bootstrap';


class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      total: 0
    };
  }

  componentDidMount() {
    this.getCart();
  }

  getCart() {
    // Get the count
    JwtRequest.get({url: '/api/carts'}, (books, jwres) => {
      if (jwres.statusCode === 200 && books) {
        let total = books.reduce((acc, book) => {
          return acc + book.price;
        }, 0);
        this.setState({
          books: books,
          total: total
        });
      }
    });
  }

  render() {
    return (
      <div>
        <Row>
          <Col md="2">
            <h3>Cart</h3>
          </Col>
        </Row>
        <Table striped size="sm">
          <thead>
          <tr>
            <th>Book</th>
            <th>Price</th>
          </tr>
          </thead>
          <tbody>
          {
            this.state.books.map((book) =>
              <tr key={book.id}>
                <td>{book.name}</td>
                <td>{book.price}</td>
              </tr>
            )}
          </tbody>
          <thead>
          <tr>
            <th>Total</th>
            <th>{this.state.total}</th>
          </tr>
          </thead>
        </Table>
      </div>
    );
  }
}

export default Cart;
