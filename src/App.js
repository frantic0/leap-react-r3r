import React, { Component } from 'react';
import logo from './logo.svg';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Leap from 'leapjs';
import BoneHand from 'leapjs-plugins';
import React3 from 'react-three-renderer';
import * as THREE from 'three';

import './App.css';

const baseBoneRotation = ( new THREE.Quaternion ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );

function addMesh( meshes ) {
  var geometry = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshNormalMaterial();
  var mesh = new THREE.Mesh( geometry, material );
  meshes.push( mesh );
  return mesh;
}

export class LeapViz extends Component {

  LeapViz.propTypes = {
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      hasUserMedia: false,
      cubeRotation: new THREE.Euler(),
      armMeshes: [],
      boneMeshes: []
    };

    this.canvas = null;

    this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this._onAnimate = () => {
      // we will get this callback every frame
      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0
        ),
      });
    };

  }

  componentDidMount(){

    Leap.loop({background: true}, this.leapAnimate.bind(this))
    .use('boneHand', {
      scene: this.leapScene,
      opacity: 1,
      arm : true
    })
    .connect()
  }

  componentWillUnmount(){

  }

  leapAnimate(frame) {

    // console.log(frame);
    let countBones = 0;
    let countArms = 0;

    this.state.armMeshes.forEach( function( item ) {
      this.leapScene.remove( item )
    });
    this.state.boneMeshes.forEach( function( item ) {
      this.leapScene.remove( item )
    });

    for ( var hand of frame.hands ) {
      for ( var finger of hand.fingers ) {
        for ( var bone of finger.bones ) {
          if ( countBones++ === 0 ){
            continue;
          }
          var boneMesh = this.state.boneMeshes [ countBones ] || addMesh( this.state.boneMeshes );
          this.updateMesh( bone, boneMesh );
        }
      }

      var arm = hand.arm;
      var armMesh = this.state.armMeshes [ countArms++ ] || addMesh( this.state.armMeshes );
      this.updateMesh( arm, armMesh );
      armMesh.scale.set( arm.width / 4, arm.width / 2, arm.length );
    }
    // renderer.render( scene, camera );

  }

  render() {
    const { width, height } = this.props;

    return (
      <React3
        mainCamera="camera" // this points to the perspectiveCamera below
        width={width}
        height={height}
        onAnimate={this._onAnimate}>
        <scene ref={node => this.leapScene = node}>
          <perspectiveCamera
            name="camera"
            fov={75}
            aspect={width / height}
            near={0.1}
            far={1000}
            position={this.cameraPosition}
          />
          <mesh rotation={this.state.cubeRotation}>
            <boxGeometry
              width={1}
              height={1}
              depth={1}
            />
            <meshBasicMaterial color={0x00ff00} />
          </mesh>
        </scene>
      </React3>
    );
  }

}

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
        <
      </div>
    );
  }
}

export default App;
