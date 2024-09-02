import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

if (!WebGL.isWebGL2Available()) {
  const warning = WebGL.getWebGL2ErrorMessage();
  document.getElementById('erroralarm').appendChild(warning);
  console.log('warning!');
}

const camera = new THREE.PerspectiveCamera(
  1000,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 40);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();

const texture = new THREE.TextureLoader();
texture.load('texture_marvel.jpg', function (texture) {
  scene.background = texture;
});

const light_ambient = new THREE.AmbientLight(0xffffff, 1);
scene.add(light_ambient);

// camera.position.z = 100;

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();
let racket;
let bg;

loader.load(
  './space.gltf',
  function (gltf) {
    console.log('im here!');
    bg = gltf.scene;
    console.log(bg);
    bg.rotation.x = Math.PI; // Rotate 30 degrees around x-axis
    bg.rotation.y = Math.PI / 4;
    // bg.rotation.z = Math.PI / 2;
    bg.scale.set(10, 10, 10);

    scene.add(bg);
    renderer.render(scene, camera);
  },
  undefined
  // function (error) {
  //   console.error('An error happend : ', error);
  // }
);

loader.load(
  './scene.gltf',
  function (gltf) {
    console.log('im here!');
    racket = gltf.scene;
    console.log(racket);
    racket.scale.set(1, 1, 1);
    racket.position.set(0, 0, 5);
    racket.rotation.x = Math.PI; // Rotate 30 degrees around x-axis
    racket.rotation.y = Math.PI / 4;
    // racket.rotation.z = Math.PI / 2;

    scene.add(racket);
    renderer.render(scene, camera);
  },
  undefined,
  function (error) {
    console.error('An error happend : ', error);
  }
);

function animate() {
  if (racket) {
    // Rotate the racket slowly
    // console.log(racket.rotation.y);
    // console.log(racket);
    racket.rotation.y += 0.005; // Adjust this value to change rotation speed
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
