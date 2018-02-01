import React, { Component } from 'react';
import Leap from 'leapjs';
import BoneHand from 'leapjs-plugins';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import React3 from 'react-three-renderer';
import _ from 'lodash';

const baseBoneRotation = ( new THREE.Quaternion() ).setFromEuler( new THREE.Euler( 0, 0, Math.PI / 2 ) );



export default class LeapViz extends Component {

  static defaultProps = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      hasUserMedia: false,
      cubeRotation1: new THREE.Euler(),
      cubeRotation2: new THREE.Euler(),
      armMeshes: [],
      boneMeshes: []
    };

    this.canvas = null;

    this.cameraPosition = new THREE.Vector3(0, 0, 5);

    this._onAnimate = () => {
      this.setState({
        cubeRotation1: new THREE.Euler(
          this.state.cubeRotation1.x + 0.1,
          this.state.cubeRotation1.y + 0.1,
          0
        ),
        cubeRotation2: new THREE.Euler(
          this.state.cubeRotation2.x + 0.3,
          this.state.cubeRotation2.y + 0.05,
          0
        ),
      });
    };

    this.setupScene = this.setupScene.bind(this);
    this.leapAnimate = this.leapAnimate.bind(this);

    const { options } = props;

    // this.controller = Leap.loop(options, (frame) => {
    //   this.setState({ frame })
    // })  // meshes assembling control on this side

    // this.controller.connect();

    console.log('constructor');
  }

  componentDidMount(){

    // this.leapAnimate = this.leapAnimate.bind(this);

    // Leap.loop({background: true}, this.leapAnimate)  // meshes assembling control on this side
    // .connect()

    const { options } = this.props;
    this.controller = Leap.loop(options, (frame) => {
                        // this.setState({ frame });
                        this.leapAnimate(frame)
                      });


    this.controller.connect();
    // console.log('componentDidMount');
    // console.log(this.leapScene);

    // (window.controller = new Leap.Controller())
    //   .use('boneHand', {
    //     scene: this.leapScene,
    //     opacity: 3,
    //     arm : false
    //   })
    //   .connect()


    // Leap.loop({background: false})  // Leap boneHand plugin builds a  model
    // .use('boneHand', {
    //   scene: this.leapScene,
    //   opacity: 3,
    //   arm : false
    // })
    // .connect()

    // this.controller = Leap.loop({background: false})  // Leap boneHand plugin builds a  model
    // .use('boneHand', {
    //   scene: this.leapScene,
    //   opacity: 3,
    //   arm : false
    // })
    // .connect()
  }

  componentWillUnmount(){
    this.controller.disconnect();
  }

  setupScene(node){
    // console.log('setupScene');
    // console.log(node);
    this.leapScene = node;
  }

  addMesh( meshes ) {
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshNormalMaterial();
    var mesh = new THREE.Mesh(geometry, material);
    meshes.push(mesh);
    return mesh;
  }

  updateMesh( bone, mesh ) {
    mesh.position.fromArray( bone.center() );
    mesh.setRotationFromMatrix( ( new THREE.Matrix4() ).fromArray( bone.matrix() ) );
    mesh.quaternion.multiply( baseBoneRotation );
    mesh.scale.set( bone.width, bone.width, bone.length );

    // console.log(mesh);
    // this.leapScene.add(mesh);
  }

  leapAnimate(frame) {

    // console.log(frame);
    let countBones = 0;
    let countArms = 0;

    this.state.armMeshes.forEach( function( item ) {
      // this.leapScene.remove( item )
    });
    this.state.boneMeshes.forEach( function( item ) {
      // this.leapScene.remove( item )
    });

    if(frame.hands !== []){
      for ( var hand of frame.hands ) {
        for ( var finger of hand.fingers ) {
          for ( var bone of finger.bones ) {
            if ( countBones++ === 0 ){
              continue;
            }
            var boneMesh = this.state.boneMeshes[countBones] || this.addMesh( this.state.boneMeshes );
            this.updateMesh( bone, boneMesh );
          }
        }
        var arm = hand.arm;
        var armMesh = this.state.armMeshes[countArms++] || this.addMesh( this.state.armMeshes );
        this.updateMesh( arm, armMesh );
        armMesh.scale.set( arm.width / 4, arm.width / 2, arm.length );
      }
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
        <scene ref={node => this.setupScene(node)}>
          <perspectiveCamera
            name="camera"
            fov={75}
            aspect={width / height}
            near={0.1}
            far={1000}
            position={this.cameraPosition}
          />
          <mesh rotation={this.state.cubeRotation1}>
            <boxGeometry
              width={1}
              height={1}
              depth={1}
            />
          <meshBasicMaterial color={0xff0000} />
          </mesh>
          <mesh rotation={this.state.cubeRotation2}>
            <boxGeometry
              width={1}
              height={1}
              depth={1}
            />
            <meshBasicMaterial color={0x00ffff} />
          </mesh>
          { this.state.armMeshes[0] }
          // { _.map(this.state.boneMeshes, m => { return m; })}
        </scene>
      </React3>
    );
  }
}
