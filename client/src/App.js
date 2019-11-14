import React from 'react';
import './App.css';
import {Container} from 'react-bootstrap';
import AppRouter from './components/helpers/AppRouter';

function App() {
  return (
    <Container className="App">
      <AppRouter/>
    </Container>
  );
}

export default App;
