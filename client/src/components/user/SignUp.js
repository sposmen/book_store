import React from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import signUp from './signUp.svg';
import AlertDismissible from '../helpers/AlertDismissible';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: {
        name: '',
        email: '',
        password: ''
      },
      error: false,
      success: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.showError = this.showError.bind(this);
    this.showSuccess = this.showSuccess.bind(this);
  }

  changeHandler = (event) => {
    let changed = this.state.newUser;
    changed[event.target.name] = event.target.value;
    this.setState({newUser: changed});
  };

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    let form = event.target;
    // eslint-disable-next-line no-undef
    io.socket.post('/api/users', this.state.newUser, (resData, jwres) => {
      if (jwres.statusCode === 400) {
        return this.showError(resData.message);
      }
      form.reset();
      return this.showSuccess('User created correctly!');
    });
  };

  showError(value) {
    return value === undefined ? this.state.error : this.setState({error: value});
  }

  showSuccess(value) {
    return value === undefined ? this.state.success : this.setState({success: value});
  }

  render() {
    return (
      <div className="UserSignUp">
        <Row>
          <Col md={{span: 8}}>
            <AlertDismissible>
              <strong>Warning!</strong> This is not a productive app. The password will not be hard encoded, so please
              be cautious
            </AlertDismissible>
            {
              this.state.error ? (
                <AlertDismissible parentValue={this.showError}>{this.state.error}</AlertDismissible>
              ) : ''
            }
            {
              this.state.success ? (
                <AlertDismissible parentValue={this.showSuccess}
                                  variant='success'>
                  {this.state.success}
                </AlertDismissible>
              ) : ''
            }
            <Form validated={this.validated} onSubmit={this.handleSubmit}>
              <Form.Group controlId="formBasicFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Enter First Name"
                  onChange={this.changeHandler}
                  required/>
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  name="email"
                  type="email"
                  placeholder="Enter Email"
                  onChange={this.changeHandler}
                  required/>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  name="password"
                  type="password"
                  placeholder="Password"
                  onChange={this.changeHandler}
                  required
                  minLength="6"/>
              </Form.Group>
              <Button variant="primary" type="submit">Sign up</Button>
            </Form>
          </Col>
          <Col>
            <img src={signUp} className="SignUp-logo" alt="logo"/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SignUp;
