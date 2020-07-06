import React from 'react';
import './App.css';
import MainContainer from './components/MainContainer';
import { StaticMainContainer } from './components/Statics/StaticMainContainer';

function App() {
  return (
    <div className="App">
      <StaticMainContainer />
      {/* <MainContainer /> */}
    </div>
  );
}

export default App;
