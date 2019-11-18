import React from 'react';
import {Alert, Button, Form, Modal} from 'react-bootstrap';
import HardJwtRequest from '../services/HardJwtRequest';
import _ from 'lodash';

class NewBook extends React.Component {

  constructor(props) {
    super(props);
    this.hideNew = props.hideNew;
    this.state = {
      newBook: {},
      error: null
    };
  }

  changeHandler = (event) => {
    let changed = this.state.newBook;
    changed[event.target.name] = event.target.value;
    this.setState({newBook: changed});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const data = new FormData(event.currentTarget);
    HardJwtRequest.post({
      url: '/api/books',
      data: data,
      headers: {'content-type': 'multipart/form-data'}
    }).then((response) => {
      this.hideNew();
    }).catch((err, body) => {
      if (_.isObject(err)) {
        this.setState({error: err.response.data});
      }
      if (_.isString(err)) this.setState({error: err});
    });
  };

  newBookForm() {
    return (
      <Modal.Body>
        {this.state.error ? <Alert variant='danger'>{this.state.error}</Alert> : ''}
        <Form.Group controlId="formBasicName">
          <Form.Label>Book Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter Book Name"
            onChange={this.changeHandler}
            required/>
        </Form.Group>
        <Form.Group controlId="formBasicAuthor">
          <Form.Label>Author Name</Form.Label>
          <Form.Control
            type="text"
            name="author"
            placeholder="Enter Author Name"
            onChange={this.changeHandler}
            required/>
        </Form.Group>
        <Form.Group controlId="formBasicPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            step="0.01"
            name="price"
            placeholder="Enter Book Price"
            onChange={this.changeHandler}
            required/>
        </Form.Group>
        <Form.Group controlId="formBasicFile">
          <Form.Label>Book File</Form.Label>
          <Form.Control
            type="file"
            name="bookFile"
            required
            accept="text/plain"
          />
        </Form.Group>
      </Modal.Body>
    );
  }

  render() {
    return (
      <Modal show={this.props.showNew} onHide={this.hideNew}>
        <Form onSubmit={this.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>New book</Modal.Title>
          </Modal.Header>
          {this.newBookForm()}
          <Modal.Footer>
            <Button variant="secondary" onClick={this.hideNew}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save Book
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default NewBook;
