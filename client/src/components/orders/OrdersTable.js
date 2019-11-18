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
            <td>{(new Date(order.createdAt)).toLocaleDateString()}</td>
            <td>{order.owner.email}</td>
            <td>{
              order.books.map(book=>
                <div key={book.id}>- {book.name}</div>
              )
            }</td>
          </tr>
        );
      })}
      </tbody>
    </Table>
  )
}

export default OrdersTable;
