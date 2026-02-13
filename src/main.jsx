import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/* ---------------- SCENE ---------------- */
const scene = new THREE.Scene();

/* ---------------- CAMERA ---------------- */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5; // further back for full-body models

/* ---------------- RENDERER ---------------- */
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = 0;
document.body.appendChild(renderer.domElement);

/* ---------------- LIGHTING ---------------- */
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(2, 3, 5);
scene.add(directional);

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

/* ---------------- LOAD MODEL ---------------- */
let model;

const loader = new GLTFLoader();
loader.load(
  '/teal.glb',
  (gltf) => {
    model = gltf.scene;

    model.scale.set(1.2, 1.2, 1.2);


    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);



    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("Error loading model:", error);
  }
);

/* ---------------- MOUSE TRACKING ---------------- */
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

/* ---------------- RESIZE HANDLER ---------------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------------- ANIMATION LOOP ---------------- */
function animate() {
  requestAnimationFrame(animate);

  if (model) {
    /* Smooth natural humanoid rotation */
    model.rotation.y += ((mouseX * 0.5) - model.rotation.y) * 0.05;
    model.rotation.x += ((mouseY * 0.3) - model.rotation.x) * 0.05;

    /* Subtle floating / alive motion */
    model.position.y += Math.sin(Date.now() * 0.001) * 0.002;
  }

  renderer.render(scene, camera);
}

animate();
