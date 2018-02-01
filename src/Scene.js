import React, { Component } from 'react';
import * as THREE from 'three';
import Leap from 'leapjs';
import HandMesh from 'leapjs-plugins';

export default class Scene extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hand1position: new THREE.Vector3(0,0,0),
      hand1rotation: new THREE.Vector3(0,0,0),
      pinky1position: new THREE.Vector3(0,0,0),
      ring1position: new THREE.Vector3(0,0,0),
      birdie1position: new THREE.Vector3(0,0,0),
      index1position: new THREE.Vector3(0,0,0),
      thumb1position: new THREE.Vector3(0,0,0),
      pinky1rotation: new THREE.Vector3(0,0,0),
      ring1rotation: new THREE.Vector3(0,0,0),
      birdie1rotation: new THREE.Vector3(0,0,0),
      index1rotation: new THREE.Vector3(0,0,0),
      thumb1rotation: new THREE.Vector3(0,0,0),
      hand2position: new THREE.Vector3(0,0,0),
      hand2rotation: new THREE.Vector3(0,0,0),
      pinky2position: new THREE.Vector3(0,0,0),
      ring2position: new THREE.Vector3(0,0,0),
      birdie2position: new THREE.Vector3(0,0,0),
      index2position: new THREE.Vector3(0,0,0),
      thumb2position: new THREE.Vector3(0,0,0),
      pinky2rotation: new THREE.Vector3(0,0,0),
      ring2rotation: new THREE.Vector3(0,0,0),
      birdie2rotation: new THREE.Vector3(0,0,0),
      index2rotation: new THREE.Vector3(0,0,0),
      thumb2rotation: new THREE.Vector3(0,0,0),
      cubeRotation: new THREE.Euler(),
      sphereRotation: new THREE.Euler(),
      torusRotation: new THREE.Euler(),
      cubePosition: new THREE.Vector3(0,0,0),
      spherePosition: new THREE.Vector3(0,0,0),
      torusPosition: new THREE.Vector3(0,0,0),
      armMeshes: [],
      boneMeshes: []
    };

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
    this.animateHands = this.animateHands.bind(this);
  }

  componentDidMount() {

    this.setupScene();

    this.setupLeap();

    this.start();
  }

  componentWillUnmount() {
    this.stop()
    this.mount.removeChild(this.renderer.domElement)
    this.leapController.disconnect();
  }

  setupScene(){

    const width = this.mount.clientWidth;
    const height = this.mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const b_geometry = new THREE.BoxGeometry(2, 1, 2);
    const b_material = new THREE.MeshBasicMaterial({ color: '#FF0000' });
    const cube = new THREE.Mesh(b_geometry, b_material);

    const s_geometry = new THREE.SphereGeometry(1, 50, 40);
    const s_material = new THREE.MeshBasicMaterial({ color: '#00FF00' });
    this.spheres = [1,2,3,4,5].map(i => new THREE.Mesh(s_geometry, s_material));

    const t_geometry = new THREE.TorusGeometry(3,1,40,50);
    const t_material = new THREE.MeshBasicMaterial({ color: '#0000FF' });
    const torus = new THREE.Mesh(t_geometry, t_material);

    camera.position.z = 20;
    scene.add(cube);
    this.spheres.map(i => scene.add(i));
    scene.add(torus);

    renderer.setClearColor('#000000');
    renderer.setSize(width, height);

    this.scene = scene;
    this.camera = camera;
    this.renderer = renderer;
    this.material = b_material;
    this.cube = cube;
    this.torus = torus;

    this.mount.appendChild(this.renderer.domElement)
  }

  setupLeap(){

    // TODO pass options with object
    this.leapController = new Leap.Controller({
      host: '127.0.0.1',
      port: 6437,
      enableGestures: false,
      background: false,
      optimizeHMD: false,
      frameEventName: 'animationFrame', // uses the browser animation loop (generally 60 fps). // 'deviceFrame' - Leap Motion controller frame rate (20 to 200 fps
      useAllPlugins: false
    });
    // .use('handHold')
    // .use('transform', { position: new THREE.Vector3(1, 0, 0)})
    // .use('handEntry')
    // .use('screenPosition')
    // .use('boneHand', {
      // parent: scene,
      // renderer: renderer,
      // scale: getParam('scale'),
      // positionScale: getParam('positionScale'),
      // offset: new THREE.Vector3(0, 0, 0),
      // renderFn: function() {
        // renderer.render(scene, camera);
        // return controls.update();
      // },
      // materialOptions: {
      //   wireframe: getParam('wireframe')
      // },
      // dotsMode: getParam('dots'),
      // stats: stats,
      // camera: camera,
      // boneLabels: function(boneMesh, leapHand) {
      //   if (boneMesh.name.indexOf('Finger_03') === 0) {
      //     return leapHand.pinchStrength;
      //   }
      // },
      // boneColors: function(boneMesh, leapHand) {
      //   if ((boneMesh.name.indexOf('Finger_0') === 0) || (boneMesh.name.indexOf('Finger_1') === 0)) {
      //     return {
      //       hue: 0.6,
      //       saturation: leapHand.pinchStrength
      //     };
      //   }
      // },
      // checkWebGL: true
    // });

    this.leapController.on('deviceAttached', function() {
      console.log('deviceAttached');
    });
    this.leapController.on('deviceStreaming', function() {
      console.log('deviceStreaming');
    });
    this.leapController.on('deviceStopped', function() {
      console.log('deviceStopped');
    });
    this.leapController.on('deviceRemoved', function() {
      console.log('deviceRemoved');
    });

    this.leapController.connect();
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate)
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId)
  }

  animate() {
    this.cube.rotation.x += 0.01
    this.cube.rotation.y += 0.01

    this.torus.position.x = this.state.hand1position.x/10;
    this.torus.position.y = this.state.hand1position.y/10;
    this.torus.position.z = this.state.hand1position.z/10;

    this.torus.rotation.x = -this.state.hand1rotation.x + 90;
    this.torus.rotation.y = this.state.hand1rotation.y + 90;
    this.torus.rotation.z = this.state.hand1rotation.z  + 90;

    this.spheres[0].position.x = this.state.pinky1position.x/10;
    this.spheres[0].position.y = this.state.pinky1position.y/10;
    this.spheres[0].position.z = this.state.pinky1position.z/10;
    this.spheres[1].position.x = this.state.ring1position.x/10;
    this.spheres[1].position.y = this.state.ring1position.y/10;
    this.spheres[1].position.z = this.state.ring1position.z/10;
    this.spheres[2].position.x = this.state.birdie1position.x/10;
    this.spheres[2].position.y = this.state.birdie1position.y/10;
    this.spheres[2].position.z = this.state.birdie1position.z/10;
    this.spheres[3].position.x = this.state.index1position.x/10;
    this.spheres[3].position.y = this.state.index1position.y/10;
    this.spheres[3].position.z = this.state.index1position.z/10;
    this.spheres[4].position.x = this.state.thumb1position.x/10;
    this.spheres[4].position.y = this.state.thumb1position.y/10;
    this.spheres[4].position.z = this.state.thumb1position.z/10;

    this.animateHands(this.leapController.frame())
  }

  animateHands(frame)
  {
    // console.log("Frame event for Leap frame " + frame.id);

    if(frame.hands[0] !== undefined)
    {
      var leapHand = frame.hands[0],
          leapFingers = frame.pointables,
          handObj, fingersObj;

          this.setState((prevState, props) => ({
            hand1position: new THREE.Vector3(leapHand.palmPosition[0],leapHand.palmPosition[1],leapHand.palmPosition[2]),
            hand1rotation: new THREE.Vector3(leapHand.palmNormal[2], leapHand.palmNormal[1], -Math.atan2(leapHand.palmNormal[0], leapHand.palmNormal[1]) + Math.PI),
            pinky1position: new THREE.Vector3(leapFingers[0].tipPosition[0], leapFingers[0].tipPosition[1], leapFingers[0].tipPosition[2]),
            ring1position: new THREE.Vector3(leapFingers[1].tipPosition[0], leapFingers[1].tipPosition[1], leapFingers[1].tipPosition[2]),
            birdie1position: new THREE.Vector3(leapFingers[2].tipPosition[0], leapFingers[2].tipPosition[1], leapFingers[2].tipPosition[2]),
            index1position: new THREE.Vector3(leapFingers[3].tipPosition[0], leapFingers[3].tipPosition[1], leapFingers[3].tipPosition[2]),
            thumb1position: new THREE.Vector3(leapFingers[4].tipPosition[0], leapFingers[4].tipPosition[1], leapFingers[4].tipPosition[2]),
            // pinky1rotation: new THREE.Vector3(leapHand.palmNormal[2], leapHand.palmNormal[1], -Math.atan2(leapHand.palmNormal[0], leapHand.palmNormal[1]) + Math.PI),
            // ring1rotation: new THREE.Vector3(leapHand.palmNormal[2], leapHand.palmNormal[1], -Math.atan2(leapHand.palmNormal[0], leapHand.palmNormal[1]) + Math.PI),
            // birdie1rotation: new THREE.Vector3(leapHand.palmNormal[2], leapHand.palmNormal[1], -Math.atan2(leapHand.palmNormal[0], leapHand.palmNormal[1]) + Math.PI),
            // index1rotation: new THREE.Vector3(leapHand.palmNormal[2], leapHand.palmNormal[1], -Math.atan2(leapHand.palmNormal[0], leapHand.palmNormal[1]) + Math.PI),
            // thumb1rotation: new THREE.Vector3(leapHand.palmNormal[2], leapHand.palmNormal[1], -Math.atan2(leapHand.palmNormal[0], leapHand.palmNormal[1]) + Math.PI),
            // torusPosition:  new THREE.Vector3(handObj.position.x,handObj.position.y,handObj.position.z)
          }));
    }

    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  renderScene() {
    this.renderer.render(this.scene, this.camera)
  }

  render() {
    return (
      <div
        style={{ width: '400px', height: '400px' }}
        ref={(mount) => { this.mount = mount }}
      />
    )
  }
}
