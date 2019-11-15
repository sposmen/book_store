import React from 'react';
import {Col, Container, Nav, Navbar, Row} from 'react-bootstrap';
import {BrowserRouter as Router, Link, Switch, Route} from 'react-router-dom';
import Clock from './components/helpers/Clock';
import {logout, me} from './components/services/AuthService';
import Menus from './components/helpers/Menus';

function Home() {
  return <h2>Welcome to the Book Store</h2>;
}

function About() {
  return <h2>About</h2>;
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };

    this.setUser = this.setUser.bind(this);
    me(this.setUser);
  }

  setUser(userData) {
    this.setState({user: userData});
  }

  userRole() {
    return this.state.user && this.state.user.accountType;
  }

  userMenu() {
    return Menus.roleMenu(this.userRole());
  }

  pages() {
    return this.userMenu().switch.map((page, idx) => <Route path={page[0]} key={page[0]}>{page[1]}</Route>);
  }

  routeLinks() {
    return this.userMenu().routes.map((route) => <Nav.Link key={route[0]} as={Link} to={route[0]}>{route[1]}</Nav.Link>);
  }

  navBar() {
    return (
      <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">Book Store</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              {this.routeLinks()}
            </Nav>

            <Nav>
              <Nav.Link as={Link} to="/about">About</Nav.Link>
              {this.userRole() ? <Nav.Link onClick={logout}>Logout</Nav.Link> : ''}
              <Navbar.Text><Clock/></Navbar.Text>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }

  pageSwitch() {
    return (
      <Switch>
        {this.pages()}
        <Route path="/about">
          <About/>
        </Route>
        <Route path="/">
          <Home/>
        </Route>
      </Switch>
    );
  }

  render() {
    return (
      <Router>
        {this.navBar()}
        <Container className="main">
          <Row>
            <Col>{this.pageSwitch()}</Col>
          </Row>
        </Container>
      </Router>
    );
  }
}

export default App;
