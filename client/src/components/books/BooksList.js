import React from 'react';
import JwtRequest from '../services/JwtRequest';
import {Button, Col, Row, Table, Pagination} from 'react-bootstrap';
import downloadLogo from '../helpers/downloadLogo.svg';
import NewBook from './NewBook';
import HardJwtRequest from '../services/HardJwtRequest';
import {createBrowserHistory} from 'history';
import signUpLogo from '../auth/signUpLogo.svg';

class BooksList extends React.Component {
  constructor(props) {
    super(props);
    this.pageSize = parseInt(this.params('pageSize')) || 5;
    this.history = createBrowserHistory();
    let page = parseInt(this.params('page')) || 1;
    this.state = {
      showNew: false,
      page: page,
      pageCount: 1,
      books: []
    };
    this.showNew = this.showNew.bind(this);
    this.hideNew = this.hideNew.bind(this);
  }

  componentDidMount() {
    this.toPage(this.state.page);
  }

  params(param = null) {
    let params = new URLSearchParams(window.location.search);
    return param ? params.get(param) : params;
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
      JwtRequest.get({url: '/api/books/count'}, (booksCount, jwres) => {
        if (jwres.statusCode === 200 && booksCount) {
          let pageCount = Math.ceil(parseInt(booksCount) / this.pageSize);
          if(this.state.page > pageCount)
            this.toPage(pageCount);
          else{
            this.setState({pageCount: pageCount});
          }

        }
      });
    }
  }

  showNew() {
    this.setState({showNew: true});
  }

  hideNew() {
    this.getBooks();
    this.setState({showNew: false});
  }

  download(book) {
    return () => {
      HardJwtRequest.download({url: `/api/books/${book.id}/download`, filename: book.name});
    };
  }

  toPage(page) {
    this.setState({page: page});
    setImmediate(()=>this.getBooks());
    this.history.push({
      pathname: '/books',
      search: '?' + new URLSearchParams({page: page}).toString()
    });
  }

  pagination() {
    let base = Math.max(this.state.page - 2, 1);
    let max = Math.min(base + 5, this.state.pageCount);
    let items = [];
    for (let number = base; number <= max; number++) {
      items.push(
        <Pagination.Item onClick={() => this.toPage(number)} key={number} active={number === this.state.page}>
          {number}
        </Pagination.Item>,
      );
    }
    return (
      <Pagination>{items}</Pagination>
    );
  }

  render() {
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

        <Table striped size="sm">
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
                <td>{book.keywords && book.keywords.join(', ')}</td>
                <td><Button variant="link" onClick={this.download(book)}>
                  <img src={downloadLogo} style={{width: 20, height: 20}} className="Download-logo" alt="logo"/>
                </Button></td>
              </tr>
            ))
          }
          </tbody>
        </Table>
        <Row><Col>{this.pagination()}</Col></Row>
      </div>
    );
  }
}

export default BooksList;
