import React from 'react';
import JwtRequest from '../services/JwtRequest';
import {Button, Col, Row, Table, Pagination, ButtonToolbar} from 'react-bootstrap';
import downloadLogo from '../helpers/downloadLogo.svg';
import NewBook from './NewBook';
import HardJwtRequest from '../services/HardJwtRequest';
import {createBrowserHistory} from 'history';
import {me} from '../services/AuthService';
import {Redirect} from 'react-router-dom';

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
      books: {},
      userRole: null,
      redirectTo: null
    };
  }

  userRole = (me) => {
    this.setState({'userRole': me ? me.accountType : null});
  };

  componentDidMount() {
    me(this.userRole);
    this.toPage(this.state.page);
  }

  params(param = null) {
    let params = new URLSearchParams(window.location.search);
    return param ? params.get(param) : params;
  }

  booksUrl() {
    let skip = (this.state.page - 1) * this.pageSize;
    return `/api/books?skip=${skip}&limit=${this.pageSize}`;
  }

  booksCountUrl() {
    return '/api/books/count';
  }

  getBooks() {
    if (this.state.page) {
      // Get the Books
      JwtRequest.get({url: this.booksUrl()}, (booksRes, jwres) => {
        if (jwres.statusCode === 200 && booksRes) {
          let books = {};
          booksRes.forEach((book) => books[book.id] = book);
          this.setState({books: books});
        }
      });

      // Get the count
      JwtRequest.get({url: this.booksCountUrl()}, (booksCount, jwres) => {
        if (jwres.statusCode === 200 && booksCount) {
          let pageCount = Math.ceil(parseInt(booksCount) / this.pageSize);
          if (this.state.page > pageCount) {
            this.toPage(pageCount);
          } else {
            this.setState({pageCount: pageCount});
          }

        }
      });
    }
  }

  toggleActive = (book) => {
    return () => {
      JwtRequest.patch({url: `/api/books/${book.id}`, data: {active: !book.active}}, (book, jwres) => {
        if (jwres.statusCode === 200 && book) {
          let books = {...this.state.books};
          books[book.id] = book;
          this.setState({books: books});
        }
      });
    };
  };

  showNew = () => {
    this.setState({showNew: true});
  };

  hideNew = () => {
    this.getBooks();
    this.setState({showNew: false});
  };

  download(book) {
    return () => {
      HardJwtRequest.download({url: `/api/books/${book.id}/download`, filename: book.name});
    };
  }

  toPage(page) {
    this.setState({page: page});
    setImmediate(() => this.getBooks());
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

  actionButtons(book) {
    return (
      <ButtonToolbar>
        <Button variant="link" onClick={this.download(book)}>
          <img src={downloadLogo} style={{width: 20, height: 20}} className="Download-logo" alt="logo"/>
        </Button>
        <Button variant={book.active ? 'success' : 'secondary'} onClick={this.toggleActive(book)}
                size="sm">
          {book.active ? 'Active' : 'Inactive'}
        </Button>
      </ButtonToolbar>
    );
  }

  showNewButton() {
    return (
      <Col>
        <Button variant="primary" onClick={this.showNew}> New </Button>
      </Col>
    );
  }

  render() {
    if(this.state.redirectTo){
      return <Redirect to={this.state.redirectTo} />
    }
    return (
      <div>
        <NewBook showNew={this.state.showNew} hideNew={this.hideNew}/>
        <Row>
          <Col md="2">
            <h3>Books</h3>
          </Col>
          {this.showNewButton()}
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

          {Object.keys(this.state.books).map((id, i) => {
            let book = this.state.books[id];
            return (
              <tr key={id}>
                <td>{book.name}</td>
                <td>{book.author}</td>
                <td>{book.price}</td>
                <td>{book.keywords && book.keywords.join(', ')}</td>
                <td>{this.actionButtons(book)}</td>
              </tr>
            );
          })}
          </tbody>
        </Table>
        <Row><Col>{this.pagination()}</Col></Row>
      </div>
    );
  }
}

export default BooksList;
