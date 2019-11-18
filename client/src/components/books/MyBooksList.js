import BooksList from './BooksList';
import {Button, ButtonToolbar} from 'react-bootstrap';
import React from 'react';
import JwtRequest from '../services/JwtRequest';

class MyBooksList extends BooksList {
  booksUrl() {
    let skip = (this.state.page - 1) * this.pageSize;
    return `/api/books?skip=${skip}&limit=${this.pageSize}&where={"active":true}`;
  }

  booksCountUrl() {
    return '/api/books/count?active=true';
  }

  addToCart(book) {
    return () => {
      JwtRequest.post({
          url: '/api/carts',
          data: {bookId: book.id}
        }, (cart, jwres) => {
          if (jwres.statusCode === 200 && cart) {
            this.setState({redirectTo: '/cart'});
          }
        }
      );
    };
  }

  actionButtons(book) {
    return (
      <ButtonToolbar>
        <Button variant="primary" onClick={this.addToCart(book)} size="sm">
          Add to Cart
        </Button>
      </ButtonToolbar>
    );
  }

  // Don't show the new Button
  showNewButton() {
    return '';
  }
}

export default MyBooksList;
