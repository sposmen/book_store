import React from 'react';
import SignIn from '../auth/SignIn';
import SignUp from '../auth/SignUp';
import BooksList from '../books/BooksList';
import UsersList from '../users/UserList';
import MyBooksList from '../books/MyBooksList';

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
    ]
  }
};

class Menus {
  static roleMenu(role) {
    return role ? menuByUser[role] : defaultMenu;
  }
}

export default Menus;
