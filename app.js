import * as THREE from "three";

const scene = new THREE.Scene();

import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const loader = new GLTFLoader();

loader.load(
  "path/to/model.glb",
  function (gltf) {
    scene.add(gltf.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
