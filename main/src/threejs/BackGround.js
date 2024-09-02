import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export class ThreeJSScene {
  constructor(container) {
    this.container = container;
    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 0, 40);
    this.camera.lookAt(0, 0, 0);

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.loadBackground();
    this.loadModel();

    this.animate();
  }

  loadBackground() {
    const texture = new THREE.TextureLoader();
    texture.load('public/pongtable.jpg', (texture) => {
      this.scene.background = texture;
    });
  }

  loadModel() {
    const loader = new GLTFLoader();
    loader.load('./scene.gltf', (gltf) => {
      this.racket = gltf.scene;
      this.racket.scale.set(1, 1, 1);
      this.racket.position.set(0, 0, 5);
      this.racket.rotation.x = Math.PI;
      this.racket.rotation.y = Math.PI / 4;
      this.racket.rotation.z = Math.PI;

      this.scene.add(this.racket);
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    if (this.racket) {
      this.racket.rotation.y += 0.005;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
