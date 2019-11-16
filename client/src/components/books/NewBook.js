import React from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import HardJwtRequest from '../services/HardJwtRequest';

class NewBook extends React.Component {

  constructor(props) {
    super(props);
    this.hideNew = props.hideNew;
    this.state = {
      newBook: {}
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  changeHandler = (event) => {
    let changed = this.state.newBook;
    changed[event.target.name] = event.target.value;
    this.setState({newUser: changed});
  };

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const data = new FormData();
    let file = document.getElementById('formBasicFile');
    data.append('bookFile', file.files[0]);
    Object.keys(this.state.newBook).forEach((key) => {
      data.append(key, this.state.newBook[key]);
    });
    HardJwtRequest.post({
      url: '/api/books',
      data: data,
      headers: {'content-type': 'multipart/form-data'}
    }).then((response) => {
      console.log(response);
      this.hideNew();
    });
  };

  newBookForm() {
    return (
      <Modal.Body>
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
            <Button type="submit" variant="primary" onClick={this.handleSubmit}>
              Save Book
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default NewBook;
