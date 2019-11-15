import React from 'react';
import ReactDOM from 'react-dom';

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';

import './index.scss';

import App from './App';

let io = sailsIOClient(socketIOClient);
io.sails.reconnection = true;
io.sails.url = window.location.hostname === 'localhost' ? `http://${window.location.hostname}:1337` : window.location.origin;
// io.sails.url = window.location.origin;
window.io = io;

ReactDOM.render(<App/>, document.getElementById('root'));
