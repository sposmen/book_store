import React from 'react';
import {Redirect} from 'react-router-dom';
import JwtRequest from '../services/JwtRequest';
import {Button, Col, Row, Table} from 'react-bootstrap';
import NewBook from './NewBook';
import HardJwtRequest from '../services/HardJwtRequest';

class BooksList extends React.Component {
  constructor(props) {
    super(props);
    this.pageSize = 10;
    this.state = {
      showNew: false,
      page: this.params('page') || 1,
      books: []
    };
    this.getBooks();
    this.showNew = this.showNew.bind(this);
    this.hideNew = this.hideNew.bind(this);
  }

  params(param = null) {
    let params = new URLSearchParams(window.location.search);
    return param ? params.get('name') : params;
  }

  getBooks() {
    if (this.state.page) {
      let skip = (this.state.page - 1) * this.pageSize;
      let url = `/api/books?skip=${skip}&limit=${this.pageSize}`;
      JwtRequest.get({url: url}, (books, jwres) => {
        if (jwres.statusCode === 200 && books) {
          this.setState({books: books});
        }
      });
    }
  }

  showNew() {
    this.setState({showNew: true});
  }

  hideNew() {
    this.setState({showNew: false});
  }

  download(book) {
    return () => {
      HardJwtRequest.download({url: `/api/books/${book.id}/download`, filename: book.name});
    };
  }

  books() {
    return (
      <div>
        <NewBook showNew={this.state.showNew} hideNew={this.hideNew}/>
        <Row>
          <Col md="2">
            <h3>Books</h3>
          </Col>
          <Col>
            <Button variant="primary" onClick={this.showNew}> New </Button>
          </Col>
        </Row>

        <Table striped bordered hover size="sm">
          <thead>
          <tr>
            <th>Name</th>
            <th>Author</th>
            <th>Price</th>
            <th>Keywords</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {
            this.state.books.map((book) => (
              <tr key={book.id}>
                <td>{book.name}</td>
                <td>{book.author}</td>
                <td>{book.price}</td>
                <td>{book.keywords}</td>
                <td><a onClick={this.download(book)}>DOWNLOAD</a></td>
              </tr>
            ))
          }
          </tbody>
        </Table>
      </div>
    );
  }

  render() {
    return (
      this.state.page ?
        this.books() :
        <Redirect to='/books?page=1'/>
    );
  }
}

export default BooksList;
