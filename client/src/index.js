import React from 'react';
import ReactDOM from 'react-dom';

import socketIOClient from 'socket.io-client';
import sailsIOClient from 'sails.io.js';


import './custom.scss';
import './index.css';

import App from './App';

let io = sailsIOClient(socketIOClient);
io.sails.reconnection = true;
io.sails.url = window.location.port === '1337' ? window.location.origin : `http://${window.location.hostname}:1337`;
window.io = io;

ReactDOM.render(<App/>, document.getElementById('root'));
