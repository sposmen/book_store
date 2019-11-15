import React from 'react';
import {Button} from 'react-bootstrap';

import {logout} from '../services/AuthService';

function Logout() {
  return (<Button type="button" onClick={logout}>Logout</Button>);
}

export default Logout;
