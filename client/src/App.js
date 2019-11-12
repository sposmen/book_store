import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom';
import './App.css';
import {Container, Nav, Navbar} from 'react-bootstrap';

// Components
import Login from './components/user/Login';
import SignUp from './components/user/SignUp';
import Clock from './components/user/Clock';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Router>
          <Navbar expand="lg" bg="dark" variant="dark">
            <Nav className="mr-auto">
              <Nav.Item>
                <Nav.Link as={Link} to="/">Home</Nav.Link>
              </Nav.Item>
              <NoLogin>
                <Nav.Item>
                  <Nav.Link as={Link} to="/sign_up">Sign Up</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav.Item>
              </NoLogin>
              <Nav.Item>
                <Nav.Link as={Link} to="/about">About</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/topics">Topics</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/public">Public Page</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/protected">Protected Page</Nav.Link>
              </Nav.Item><Nav.Item>
                <Navbar.Text><Clock/></Navbar.Text>
              </Nav.Item>
            </Nav>
          </Navbar>
          <Container>
            <Switch>
              <Route path="/login">
                <Login/>
              </Route>
              <Route path="/sign_up">
                <SignUp/>
              </Route>
              <Route path="/topics">
                <Topics/>
              </Route>
              <Route path="/about">
                <About/>
              </Route>
              <Route path="/">
                <Home/>
              </Route>
            </Switch>
          </Container>
        </Router>
      </div>
    );
  }
}

function NoLogin({children, ...rest}) {

  return Math.random() >= 0.5 ? (children) : '';

}

function Home() {
  return <h2>Home</h2>;
}

function About() {
  return <h2>About</h2>;
}

function Topics() {
  let match = useRouteMatch();

  return (
    <div>
      <h2>Topics</h2>

      <ul>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>
            Props v. State
          </Link>
        </li>
      </ul>

      {/* The Topics page has its own <Switch> with more routes
          that build on the /topics URL path. You can think of the
          2nd <Route> here as an "index" page for all topics, or
          the page that is shown when no topic is selected */}
      <Switch>
        <Route path={`${match.path}/:topicId`}>
          <Topic/>
        </Route>
        <Route path={match.path}>
          <h3>Please select a topic.</h3>
        </Route>
      </Switch>
    </div>
  );
}

function Topic() {
  let {topicId} = useParams();
  return <h3>Requested topic ID: {topicId}</h3>;
}

export default App;
