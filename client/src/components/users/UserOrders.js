import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import OrdersTable from '../orders/OrdersTable';
import JwtRequest from '../services/JwtRequest';

class UserOrders extends React.Component {

  constructor(props) {
    super(props);
    this.hideOrders = props.hideOrders;
    this.state = {
      orders: {},
      error: null
    };
  }

  componentDidMount() {
    let url = `/api/users/${this.props.showOrders.id}/orders?sort=createdAt%20DESC`;
    // Get the Users
    JwtRequest.get({url: url}, (ordersRes, jwres) => {
      if (jwres.statusCode === 200 && ordersRes) {
        let orders = {};
        ordersRes.forEach((order) => orders[order.id] = order);
        this.setState({orders: orders});
      }
    });
  }

  ordersTable() {
    return (
      <Modal.Body>
        <OrdersTable orders={this.props.orders}/>
      </Modal.Body>
    );
  }

  render() {
    return (
      <Modal size="lg" show={!!this.props.showOrders} onHide={this.hideOrders}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.showOrders.name} - Orders</Modal.Title>
        </Modal.Header>
        {this.ordersTable()}
        <Modal.Footer>
          <Button variant="secondary" onClick={this.hideOrders}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default UserOrders;
