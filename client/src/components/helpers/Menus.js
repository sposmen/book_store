import React from 'react';
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import BooksList from '../books/BooksList';
import UsersList from '../users/UserList';
import MyBooksList from '../books/MyBooksList';
import OrdersList from '../orders/OrdersList';
import MyOrdersList from '../orders/MyOrdersList';
import Cart from '../cart/Cart';

const defaultMenu = {
  routes: [
    ['/sign_in', 'Sign In'],
    ['/sign_up', 'Sign Up'],
  ],
  switch: [
    ['/sign_up', <SignUp/>],
    ['/sign_in', <SignIn/>]
  ]
};

const menuByUser = {
  user: {
    routes: [
      ['/books', 'Books'],
      ['/orders', 'My orders'],
      ['/cart', 'My cart'],
    ],
    switch: [
      ['/books', <MyBooksList/>],
      ['/orders', <MyOrdersList/>],
      ['/cart', <Cart/>],
    ]
  },
  admin: {
    routes: [
      ['/books', 'Books'],
      ['/users', 'Users'],
      ['/orders', 'Orders'],
    ],
    switch: [
      ['/books', <BooksList/>],
      ['/users', <UsersList/>],
      ['/orders', <OrdersList/>],
    ]
  }
};

class Menus {
  static roleMenu(role) {
    return role ? menuByUser[role] : defaultMenu;
  }
}

export default Menus;
