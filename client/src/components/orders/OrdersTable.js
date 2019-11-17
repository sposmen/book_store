import {Table} from 'react-bootstrap';
import React from 'react';

/**
 * @return {string}
 */
function OrdersTable(props) {
  return !props.orders ? '' : (
    <Table striped size="sm">
      <thead>
      <tr>
        <th>Order ID</th>
        <th>Date</th>
        <th>User Email</th>
        <th>Books</th>
      </tr>
      </thead>
      <tbody>
      {Object.keys(props.orders).map((id) => {
        let order = props.orders[id];
        return (
          <tr key={id}>
            <td>{id}</td>
            <td>{order.name}</td>
            <td>{order.email}</td>
            <td>{order.books}</td>
          </tr>
        );
      })}
      </tbody>
    </Table>
  )
}

export default OrdersTable;
