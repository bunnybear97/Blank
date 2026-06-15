import * as THREE from 'three';

const canvas = document.getElementById('hero3d');
const container = canvas.parentElement;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 1.4, 5.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
scene.add(new THREE.AmbientLight(0x8b5cf6, 0.6));
const key = new THREE.PointLight(0xa78bfa, 60, 20);
key.position.set(4, 5, 5);
scene.add(key);
const rim = new THREE.PointLight(0x38bdf8, 40, 20);
rim.position.set(-5, 2, -3);
scene.add(rim);

// Screen texture (code editor look)
function makeScreenTexture() {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 320;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#0e0e16';
  ctx.fillRect(0, 0, c.width, c.height);

  const colors = ['#8b5cf6', '#a78bfa', '#38bdf8', '#5a5a8a'];
  let y = 24;
  for (let i = 0; i < 12; i++) {
    const indent = 20 + (i % 3) * 28;
    const width = 80 + Math.random() * 300;
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(indent, y, width, 12);
    y += 24;
  }
  return new THREE.CanvasTexture(c);
}

const computer = new THREE.Group();

// Monitor body
const bodyGeo = new THREE.BoxGeometry(3.4, 2.2, 0.15);
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1c1c2b, metalness: 0.6, roughness: 0.3 });
const body = new THREE.Mesh(bodyGeo, bodyMat);
computer.add(body);

// Screen
const screenGeo = new THREE.PlaneGeometry(3.1, 1.9);
const screenMat = new THREE.MeshStandardMaterial({
  map: makeScreenTexture(),
  emissive: 0x8b5cf6,
  emissiveIntensity: 0.35,
});
const screen = new THREE.Mesh(screenGeo, screenMat);
screen.position.z = 0.08;
computer.add(screen);

// Stand neck
const neckGeo = new THREE.BoxGeometry(0.25, 0.9, 0.2);
const neckMat = new THREE.MeshStandardMaterial({ color: 0x2a2a3a, metalness: 0.7, roughness: 0.4 });
const neck = new THREE.Mesh(neckGeo, neckMat);
neck.position.set(0, -1.55, 0);
computer.add(neck);

// Base
const baseGeo = new THREE.CylinderGeometry(1.0, 1.1, 0.12, 32);
const base = new THREE.Mesh(baseGeo, neckMat);
base.position.set(0, -2.05, 0);
computer.add(base);

// Glow ring under base
const ringGeo = new THREE.TorusGeometry(1.3, 0.02, 16, 64);
const ringMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
const ring = new THREE.Mesh(ringGeo, ringMat);
ring.position.set(0, -2.1, 0);
ring.rotation.x = Math.PI / 2;
computer.add(ring);

scene.add(computer);

// Floating particles
const particlesGeo = new THREE.BufferGeometry();
const count = 80;
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 8;
  positions[i + 1] = (Math.random() - 0.5) * 6;
  positions[i + 2] = (Math.random() - 0.5) * 6;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.04, transparent: true, opacity: 0.8 });
const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

let mouseX = 0, mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

// Contact section globe
const contactCanvas = document.getElementById('contact3d');
let globe, globeCamera, globeScene, globeRenderer;
if (contactCanvas) {
  globeScene = new THREE.Scene();
  globeCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  globeCamera.position.set(0, 0, 4.5);

  globeRenderer = new THREE.WebGLRenderer({ canvas: contactCanvas, antialias: true, alpha: true });
  globeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  globeScene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const gLight = new THREE.PointLight(0xa78bfa, 50, 20);
  gLight.position.set(3, 3, 3);
  globeScene.add(gLight);

  globe = new THREE.Group();
  const wireGeo = new THREE.IcosahedronGeometry(1.4, 2);
  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.4,
  });
  globe.add(new THREE.Mesh(wireGeo, wireMat));

  const coreGeo = new THREE.IcosahedronGeometry(1.1, 1);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.7,
    roughness: 0.2,
    transparent: true,
    opacity: 0.3,
  });
  globe.add(new THREE.Mesh(coreGeo, coreMat));

  globeScene.add(globe);

  function resizeGlobe() {
    const w = contactCanvas.parentElement.clientWidth;
    const h = contactCanvas.parentElement.clientHeight;
    globeRenderer.setSize(w, h);
    globeCamera.aspect = w / h;
    globeCamera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resizeGlobe);
  resizeGlobe();
}

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  computer.rotation.y = Math.sin(t * 0.4) * 0.5 + mouseX * 0.3;
  computer.rotation.x = Math.cos(t * 0.3) * 0.08 + mouseY * 0.1;
  computer.position.y = Math.sin(t * 0.8) * 0.1;

  ring.rotation.z = t * 0.5;
  particles.rotation.y = t * 0.02;

  renderer.render(scene, camera);

  if (globe) {
    globe.rotation.y = t * 0.3;
    globe.rotation.x = Math.sin(t * 0.2) * 0.2;
    globeRenderer.render(globeScene, globeCamera);
  }
}
animate();
