import React from 'react';
import JwtRequest from '../services/JwtRequest';
import {Button, Col, Row, Table, Pagination, ButtonToolbar} from 'react-bootstrap';
import {createBrowserHistory} from 'history';
import UserOrders from './UserOrders';

class UsersList extends React.Component {
  constructor(props) {
    super(props);
    this.pageSize = parseInt(this.params('pageSize')) || 5;
    this.history = createBrowserHistory();
    let page = parseInt(this.params('page')) || 1;
    this.state = {
      showOrders: false,
      page: page,
      pageCount: 1,
      users: {},
    };
  }

  componentDidMount() {
    this.toPage(this.state.page);
  }

  params(param = null) {
    let params = new URLSearchParams(window.location.search);
    return param ? params.get(param) : params;
  }

  getUsers() {
    if (this.state.page) {
      let skip = (this.state.page - 1) * this.pageSize;
      let url = `/api/users?skip=${skip}&limit=${this.pageSize}`;
      // Get the Users
      JwtRequest.get({url: url}, (usersRes, jwres) => {
        if (jwres.statusCode === 200 && usersRes) {
          let users = {};
          usersRes.forEach((user) => users[user.id] = user);
          this.setState({users: users});
        }
      });

      // Get the count
      JwtRequest.get({url: '/api/users/count'}, (usersCount, jwres) => {
        if (jwres.statusCode === 200 && usersCount) {
          let pageCount = Math.ceil(parseInt(usersCount) / this.pageSize);
          if (this.state.page > pageCount) {
            this.toPage(pageCount);
          } else {
            this.setState({pageCount: pageCount});
          }

        }
      });
    }
  }

  toggleActive = (user) => {
    return () => {
      JwtRequest.patch({url: `/api/users/${user.id}`, data: {active: !user.active}}, (user, jwres) => {
        if (jwres.statusCode === 200 && user) {
          let users = {...this.state.users};
          users[user.id] = user;
          this.setState({users: users});
        }
      });
    };
  };

  showOrders = (user) => {
    return () => {
      this.setState({showOrders: user});
    };

  };

  hideOrders = () => {
    this.setState({showOrders: false});
  };

  toPage(page) {
    this.setState({page: page});
    setImmediate(() => this.getUsers());
    this.history.push({
      pathname: '/users',
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
        {
          !!this.state.showOrders ?
            <UserOrders showOrders={this.state.showOrders} hideOrders={this.hideOrders}/> :
            ''
        }
        <Row>
          <Col md="2">
            <h3>Users</h3>
          </Col>
        </Row>

        <Table striped size="sm">
          <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Orders</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>

          {Object.keys(this.state.users).map((id, i) => {
            let user = this.state.users[id];
            return (
              <tr key={id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.orders.length}</td>
                <td>
                  <ButtonToolbar>
                    <Button variant={user.active ? 'success' : 'secondary'} onClick={this.toggleActive(user)} size="sm">
                      {user.active ? 'Active' : 'Inactive'}
                    </Button>&nbsp;
                    <Button variant="primary" onClick={this.showOrders(user)} size="sm">Orders</Button>
                  </ButtonToolbar>
                </td>
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

export default UsersList;
