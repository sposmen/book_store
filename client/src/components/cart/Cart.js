import React from 'react';
import JwtRequest from '../services/JwtRequest';
import {Button, Col, Row, Table} from 'react-bootstrap';
import {Redirect} from 'react-router-dom';


class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
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

  placeOrder = ()=> {
    JwtRequest.post({url: '/api/carts/placeOrder'}, (books, jwres) => {
      if (jwres.statusCode === 200 && books) {
        this.setState({redirectTo:'/orders'});
      }
    });
  };

  render() {
    if(this.state.redirectTo){
      return <Redirect to={this.state.redirectTo} />
    }
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

        <Button onClick={this.placeOrder} variant="primary" disabled={!this.state.books.length}>Place Order</Button>
      </div>
    );
  }
}

export default Cart;
