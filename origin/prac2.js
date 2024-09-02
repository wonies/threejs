import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js'; // 다른 브라우저에서 호환되지 않을때
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

if (!WebGL.isWebGL2Available()) {
  const warning = WebGL.getWebGL2ErrorMessage();
  document.getElementById('erroralarm').appendChild(warning);
  console.log('warning!');
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  1,
  500
);
camera.position.set(0, 0, 100);
camera.lookAt(0, 0, 0);

const scene = new THREE.Scene();
//3D객체들을 담을 장면을 생성
const material = new THREE.LineBasicMaterial({ color: '9966FF' });
//연한 보라색의 기본 선 재질을 생성
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
//삼각형 모양을 이루는 세 점을 생성

const geometry = new THREE.BufferGeometry().setFromPoints(points);
//이 점들로부터 BufferGeometry생성함
const line = new THREE.Line(geometry, material);
// geometry와 material을 이용해 선객체를 생성함
scene.add(line);
// 생성한 선 장면에 추가
renderer.render(scene, camera);
// 최종적으로 장면을 랜더링
