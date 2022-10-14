import * as THREE from "three";
import { GLTFLoader } from "https://unpkg.com/three@0.145.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://unpkg.com/three@0.145.0/examples/jsm/controls/OrbitControls.js";
let camera, scene, renderer, model;
let busy = false;
let mouseX = 0,
  mouseY = 0;

let cursorX = 0,
  cursorY = 0;

let logoMove = true;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
init();
animate();

function init() {
  const container = document.createElement("div");
  const tms_body = document.getElementById("tms_main");
  container.classList.add("tms_canvas");
  tms_body.appendChild(container);
  // document.body.appendChild(container);

  // 카메라
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 30;

  // 장면
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.Fog(0xffffff, 1, 1000);

  // 조명
  scene.add(new THREE.HemisphereLight(0x888877, 0x777788));

  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 20, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(-10, 5, 4);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 2;
  dirLight.shadow.camera.bottom = -2;
  dirLight.shadow.camera.left = -2;
  dirLight.shadow.camera.right = 2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 20;
  scene.add(dirLight);

  // 바닥

  // const mesh = new THREE.Mesh(
  //   new THREE.PlaneGeometry(100, 100),
  //   new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
  // );
  // mesh.rotation.x = -Math.PI / 2;
  // mesh.receiveShadow = true;
  // scene.add(mesh);

  // 로딩 시 호출
  const onProgress = function (xhr) {
    // console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  };

  // 로딩 시 에러가 발생하는 경우 호출
  const onError = function () {
    console.log("An error happened");
  };

  // 모델 불러오기

  const loader = new GLTFLoader();

  function loadGeometry(url) {
    loader.load(
      url,
      function (gltf) {
        model = gltf.scene;

        model.traverse(function (object) {
          if (object.isMesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });
        const modelScale = 0.1;
        model.scale.set(modelScale, modelScale, modelScale);

        scene.add(model);
      },
      onProgress,
      onError
    );
  }

  // 모델 url
  loadGeometry("https://two-more-steps.github.io/app/logo.gltf");

  // 렌더링
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // 컨트롤러
  // const controls = new OrbitControls(camera, renderer.domElement);

  // 이벤트 리스너
  document.addEventListener("mousemove", onDocumentMouseMove);
  document.addEventListener("click", onDocumentClick);
  window.addEventListener("resize", onWindowResize);
}

//  리사이즈
function onWindowResize() {
  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//  마우스 무브
function onDocumentMouseMove(event) {
  mouseX = (event.clientX - windowHalfX) / 2;
  mouseY = (event.clientY - windowHalfY) / 2;

  cursorX = event.clientX;
  cursorY = event.clientY;

  let mouseCursor = document.querySelector(".cursor");
  mouseCursor.style.left = event.clientX + "px";
  mouseCursor.style.top = event.clientY + "px";
  mouseCursor.style.opacity = 1;
}

// 클릭이벤트
function onDocumentClick(event) {
  if (logoMove) {
    logoMove = false;
  } else {
    logoMove = true;
  }
}
//   애니메이션
function animate() {
  requestAnimationFrame(animate);
  render();
}

//   렌더링 함수
function render() {
  let cameraX = ((cursorX - windowHalfX) / windowHalfX) * 20;
  let cameraY = ((cursorY - windowHalfY) / windowHalfY) * 10;

  if (model && logoMove) {
    model.rotation.x += (mouseY / 100 - model.rotation.x) * 0.0025;
    model.rotation.y += (mouseX / 100 - model.rotation.y) * 0.0025;
    camera.position.x += (-cameraX - camera.position.x) * 0.0125;
    camera.position.y += (cameraY - camera.position.y) * 0.0125;
    camera.position.z += (30 - camera.position.z) * 0.025;
  } else if (model) {
    model.rotation.x += -model.rotation.x * 0.025;
    model.rotation.y += -model.rotation.y * 0.025;
    camera.position.x += -camera.position.x * 0.025;
    camera.position.y += -camera.position.y * 0.025;
    camera.position.z += (3 - camera.position.z) * 0.025;
  }

  if (camera.position.z < 3.2) {
    document.querySelector(".tms_canvas canvas").style.opacity = 0;
  } else {
    document.querySelector(".tms_canvas canvas").style.opacity = 1;
  }
  renderer.render(scene, camera);
}

// UI
