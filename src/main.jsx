import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,  
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;  

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.style.margin = 0;
document.body.style.overflow = 'hidden';
document.body.appendChild(renderer.domElement);

const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(2, 2, 5);
scene.add(directional);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);

let model;
const loader = new GLTFLoader();

loader.load(
  '/head-model.glb',
  (gltf) => {
    model = gltf.scene;


    model.scale.set(0.5, 0.5, 0.5);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);


    model.position.y -= 0.1;

    scene.add(model);
  },
  undefined,
  (error) => console.error('Error loading model:', error)
);


let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


function animate() {
  requestAnimationFrame(animate);

if (model) {
    const time = Date.now() * 0.001;

  
    model.rotation.y += (mouseX * 0.3 - model.rotation.y) * 0.05;
    model.rotation.x += (-mouseY * 0.15 - model.rotation.x) * 0.05; // notice the negative here

    model.position.y += Math.sin(time * 1.5) * 0.0005;
    model.rotation.z = Math.sin(time * 0.8) * 0.005;
}


  renderer.render(scene, camera);
}

animate();
