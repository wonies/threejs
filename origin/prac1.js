import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js'; // 다른 브라우저에서 호환되지 않을때

if (!WebGL.isWebGL2Available()) {
  const warning = WebGL.getWebGL2ErrorMessage();
  document.getElementById('erroralarm').appendChild(warning);
}

const scene = new THREE.Scene();
/*
- Scene은 3d객체, 조명, 카메라 등을 포함하는 컨테이너 역할을 함
- camera는 새 원근 카메라를 생성함
- 매개변수:
  - 75: 시야각(FOV)을 나타냄 단위는 도(degree)
  - window.innerWidth / window.innerHeight : 화면의 가로/세로 비율
  - 0.1 : 근 평면 => 이 거리보다 가까운 객체는 랜더링되지 않음
  - 1000 : 원 평면 => 이 거리보다 먼 객체는 랜더링되지 않음
- renderer: WebGL을 사용해 3d그래픽을 랜더링할 랜더러를 생성함
  - WebGL은 웹 브라우저에서 하드웨어 가속 그래픽을 제공하는 js api

*/
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

/*
setSize : 렌더러의 출력 캔버스 크기를 설정함
  - 브라우저 창 전체너비와 넓이로 설정하여 전체 화면을 채움
setAnimationLoop(animate); : 렌더러의 애니메이션 루프를 설정함
  - animate함수를 계속 반복 실행하여 애니메이션을 만듦
appendChild(renderer.domElement); : 랜더러의 캔버스 요소를 HTML문서의 body에 추가함
- 이로써 3D그래픽이 실제로 웹페이지에 표시됨
BoxGeometry(1, 1, 1); : 1 x 1 x 1 정육면체 형상 생성
Mesh- : 초록색 물질 생성
  - 조명의 영향을 받지 않는 단순 재질
THREE.Mesh(g, m); : 앞서 만든 형상과 재질을 이용해 메시 객체를 생성함
  - 메시는 3D 공간에 렌더링 될 수 있는 객체
scene.add(cube); // 생성한 큐브 메시를 장면에 추가함
camera.position.z = 5; // z축 위치를 5로 설정
animate()
  - 애니메이션 루프 함수 / 계속 반복 실행됨
cube.rotation.x,y : 매 프레임 마다 큐브의 x,y축 회전을 0.01라디안씩 증가
  - 큐브가 계속 회전하는 애니메이션 효과 생김
renderer.render(scene, camera);
  - 현재 장면과 카메라 상태 기반으로 3D그래픽 렌더링
  - 매 프레임마다 호출되어 화면 갱신함
 */

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate); // 함수를 계속 호출 three.js가 자동으로 함수 호출함
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
