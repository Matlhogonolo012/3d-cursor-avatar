import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './cursor.css';


export function startEyeFollower() {

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
  document.body.style.margin = '0';
  document.body.style.overflow = 'hidden';
  document.body.appendChild(renderer.domElement);

  const directional = new THREE.DirectionalLight(0xffffff, 1);
  directional.position.set(2, 2, 5);
  scene.add(directional);

  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const cursor = document.createElement("div");
  cursor.className = "invert-cursor";
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  let model;
  let leftEye, rightEye;

  const loader = new GLTFLoader();
  loader.load('/Untitled1.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    model.position.y -= 0.1;

    scene.add(model);

    model.traverse((obj) => {
      if (obj.name === "Eyes_L" || obj.name === "Eye_L") leftEye = obj;
      if (obj.name === "Eyes_R" || obj.name === "Eye_R") rightEye = obj;
    });

    console.log("Left Eye:", leftEye);
    console.log("Right Eye:", rightEye);
  });

  let mouseX = 0;
  let mouseY = 0;

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = false;

  document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    mouse.x = mouseX;
    mouse.y = mouseY;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function animate() {
    requestAnimationFrame(animate);

    if (model) {
      const time = Date.now() * 0.001;

      if (leftEye) {
        const targetY = clamp(mouseX * 0.25, -0.35, 0.35);
        const targetX = clamp(-mouseY * 0.15, -0.25, 0.25);
        leftEye.rotation.y += (targetY - leftEye.rotation.y) * 0.25;
        leftEye.rotation.x += (targetX - leftEye.rotation.x) * 0.25;
      }

      if (rightEye) {
        const targetY = clamp(mouseX * 0.25, -0.35, 0.35);
        const targetX = clamp(-mouseY * 0.15, -0.25, 0.25);
        rightEye.rotation.y += (targetY - rightEye.rotation.y) * 0.25;
        rightEye.rotation.x += (targetX - rightEye.rotation.x) * 0.25;
      }

      model.rotation.y += (mouseX * 0.35 - model.rotation.y) * 0.06;
      model.rotation.x += (-mouseY * 0.18 - model.rotation.x) * 0.06;

      model.position.y = Math.sin(time * 1.4) * 0.05;
      model.rotation.z = Math.sin(time * 0.7) * 0.02;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(model, true);

      if (intersects.length > 0) {
        if (!hovered) {
          cursor.classList.add("active");
          hovered = true;
        }
      } else {
        if (hovered) {
          cursor.classList.remove("active");
          hovered = false;
        }
      }
    }

    renderer.render(scene, camera);
  }

  animate();
}
