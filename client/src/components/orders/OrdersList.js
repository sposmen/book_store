import React from 'react';
import JwtRequest from '../services/JwtRequest';
import {Col, Row, Pagination} from 'react-bootstrap';
import {createBrowserHistory} from 'history';
import {me} from '../services/AuthService';
import OrdersTable from './OrdersTable';

class OrdersList extends React.Component {
  constructor(props) {
    super(props);
    this.pageSize = parseInt(this.params('pageSize')) || 5;
    this.history = createBrowserHistory();
    let page = parseInt(this.params('page')) || 1;
    this.state = {
      page: page,
      pageCount: 1,
      orders: {},
      userRole: null
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

  ordersUrl(){
    let skip = (this.state.page - 1) * this.pageSize;
    return `/api/orders?skip=${skip}&limit=${this.pageSize}`;
  }

  ordersCountUrl(){
    return '/api/orders/count'
  }

  getOrders() {
    if (this.state.page) {

      // Get the orders
      JwtRequest.get({url: this.ordersUrl()}, (ordersRes, jwres) => {
        if (jwres.statusCode === 200 && ordersRes) {
          let orders = {};
          ordersRes.forEach((user) => orders[user.id] = user);
          this.setState({orders: orders});
        }
      });

      // Get the count
      JwtRequest.get({url: this.ordersCountUrl()}, (ordersCount, jwres) => {
        if (jwres.statusCode === 200 && ordersCount) {
          let pageCount = Math.ceil(parseInt(ordersCount) / this.pageSize);
          if (this.state.page > pageCount) {
            this.toPage(pageCount);
          } else {
            this.setState({pageCount: pageCount});
          }

        }
      });
    }
  }

  toPage(page) {
    this.setState({page: page});
    setImmediate(() => this.getOrders());
    this.history.push({
      pathname: '/orders',
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
        <Row>
          <Col md="2">
            <h3>Orders</h3>
          </Col>
        </Row>
        <OrdersTable orders={this.state.orders}/>
        <Row><Col>{this.pagination()}</Col></Row>
      </div>
    );
  }
}

export default OrdersList;
