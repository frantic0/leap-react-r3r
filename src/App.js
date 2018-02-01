import React, { Component } from 'react';
import logo from './logo.svg';
import PropTypes from 'prop-types';
import Leap from 'leapjs';
import BoneHand from 'leapjs-plugins';
import React3 from 'react-three-renderer';

import _ from 'lodash';

// import LeapViz from './LeapViz.js';
// import LeapScene from './LeapScene.js';
import Scene from './Scene.js';


import './App.css';



// <LeapViz width={300} height={150}/>
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Scene width={300} height={150}/>
      </div>
    );
  }
}

export default App;
