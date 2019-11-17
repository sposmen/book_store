import React from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {signIn} from '../services/AuthService';
import AlertDismissible from '../helpers/AlertDismissible';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.children = props.children;
    this.state = {
      newUser: {
        email: '',
        password: ''
      },
      error: false
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
    signIn(this.state.newUser, (resData, jwres) => {
      if (jwres.statusCode === 400) {
        return this.showError(resData);
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
            <div className="UserSignIn">
              {
                this.state.error ? (
                  <AlertDismissible parentValue={this.showError}>{this.state.error}</AlertDismissible>
                ) : ''
              }
              <Form onSubmit={this.handleSubmit}>
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
                <Button variant="primary" type="submit">Sign In</Button>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SignIn;
