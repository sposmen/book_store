import React from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import signUpLogo from './signUpLogo.svg';
import AlertDismissible from '../helpers/AlertDismissible';
import {signUp} from '../services/AuthService';

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
  }

  changeHandler = (event) => {
    let changed = this.state.newUser;
    changed[event.target.name] = event.target.value;
    this.setState({newUser: changed});
  };

  handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    signUp(this.state.newUser, (resData, jwres) => {
      if (jwres.statusCode === 400) {
        return this.showError(resData.message);
      }
    });
  };

  showError(value) {
    return value === undefined ? this.state.error : this.setState({error: value});
  }

  render() {
    return (
      <div className="UserSignUp">
        <Row>
          <Col md={{span: 8}}>
            {
              this.state.error ? (
                <AlertDismissible parentValue={this.showError}>{this.state.error}</AlertDismissible>
              ) : ''
            }
            <Form onSubmit={this.handleSubmit}>
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
            <img src={signUpLogo} className="SignUp-logo" alt="logo"/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SignUp;
