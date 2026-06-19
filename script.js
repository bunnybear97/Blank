/* ============================================================
   STARS CANVAS — Three.js
============================================================ */
function initStars() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const COUNT = 7000;
  const positions = new Float32Array(COUNT * 3);
  const colors    = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    colors[i * 3]     = 0.8 + Math.random() * 0.2;
    colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
    colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors,    3));

  const mat   = new THREE.PointsMaterial({ size: 0.004, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.85 });
  const stars = new THREE.Points(geo, mat);
  scene.add(stars);
  camera.position.z = 1;

  (function animate() {
    requestAnimationFrame(animate);
    stars.rotation.x += 0.00007;
    stars.rotation.y += 0.00007;
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

/* ============================================================
   3D ROTATING COMPUTER (hero) — procedural, no external model file
============================================================ */
function initComputerModel() {
  const canvas = document.getElementById('computer-canvas');
  if (!canvas || typeof THREE === 'undefined') return;
  if (window.innerWidth <= 900) return;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(2.4, 1.5, 4.4);
  camera.lookAt(0, 0.8, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const pointLight = new THREE.PointLight(0x915eff, 3, 20);
  pointLight.position.set(2, 3, 3);
  scene.add(pointLight);
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(-3, 4, 2);
  scene.add(dirLight);

  const computer = new THREE.Group();

  // Monitor frame
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 1.4, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x1d1836, metalness: 0.3, roughness: 0.5 })
  );
  frame.position.set(0, 1.1, 0);
  computer.add(frame);

  // Glowing "code editor" screen texture
  const sc = document.createElement('canvas');
  sc.width = 512; sc.height = 320;
  const ctx = sc.getContext('2d');
  ctx.fillStyle = '#0c0820';
  ctx.fillRect(0, 0, 512, 320);
  const codeColors = ['#915eff', '#c084fc', '#4ade80', '#60a5fa', '#f472b6'];
  for (let i = 0; i < 13; i++) {
    ctx.fillStyle = codeColors[i % codeColors.length];
    const w = 50 + Math.random() * 300;
    ctx.fillRect(20 + Math.random() * 40, 14 + i * 22, w, 9);
  }
  const screenTex = new THREE.CanvasTexture(sc);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.95, 1.2),
    new THREE.MeshStandardMaterial({ map: screenTex, emissive: 0x915eff, emissiveIntensity: 0.35, emissiveMap: screenTex })
  );
  screen.position.set(0, 1.1, 0.065);
  computer.add(screen);

  const standMat = new THREE.MeshStandardMaterial({ color: 0x2a2350, metalness: 0.4, roughness: 0.4 });

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.5, 16), standMat);
  neck.position.set(0, 0.35, 0);
  computer.add(neck);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.06, 32), standMat);
  base.position.set(0, 0.07, 0);
  computer.add(base);

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.07, 0.5),
    new THREE.MeshStandardMaterial({ color: 0x1d1836, metalness: 0.2, roughness: 0.6 })
  );
  keyboard.position.set(0, 0.03, 0.95);
  computer.add(keyboard);

  computer.position.set(0, -0.7, 0);
  scene.add(computer);

  // Secondary device — vertical tower with spinning RGB rings (beside the monitor)
  const rgbTower = new THREE.Group();

  const towerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.12, 0.9, 24),
    new THREE.MeshStandardMaterial({ color: 0x12102a, metalness: 0.6, roughness: 0.3 })
  );
  rgbTower.add(towerBody);

  const ringColors = [0x60a5fa, 0x915eff, 0xfc4d97];
  const rgbRings = [];
  ringColors.forEach((color, i) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.22 - i * 0.04, 0.012, 16, 64),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 1.1, metalness: 0.2, roughness: 0.3 })
    );
    ring.position.y = 0.3 - i * 0.02;
    ring.rotation.x = Math.PI / 2;
    rgbTower.add(ring);
    rgbRings.push(ring);
  });

  const towerBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.24, 0.05, 32),
    standMat
  );
  towerBase.position.y = -0.45;
  rgbTower.add(towerBase);

  rgbTower.position.set(1.55, 0.55, -0.4);
  scene.add(rgbTower);

  // Orbiting purple accent shapes
  const accents = [];
  for (let i = 0; i < 6; i++) {
    const mesh = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.07 + Math.random() * 0.05, 0),
      new THREE.MeshStandardMaterial({
        color: 0x915eff,
        emissive: 0x915eff,
        emissiveIntensity: 0.6,
        wireframe: Math.random() > 0.5,
      })
    );
    mesh.userData = {
      angle: (i / 6) * Math.PI * 2,
      radius: 1.6 + Math.random() * 0.6,
      speed: 0.3 + Math.random() * 0.3,
      yOff: Math.random() * Math.PI * 2,
    };
    accents.push(mesh);
    scene.add(mesh);
  }

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    computer.rotation.y = Math.sin(t * 0.4) * 0.35;
    computer.position.y = -0.7 + Math.sin(t * 0.8) * 0.05;
    rgbTower.rotation.y += 0.012;
    rgbTower.position.y = 0.55 + Math.sin(t * 0.9 + 1) * 0.04;
    rgbRings.forEach((ring, i) => {
      ring.rotation.z += 0.01 + i * 0.004;
    });
    accents.forEach(mesh => {
      const d = mesh.userData;
      mesh.position.set(
        Math.cos(t * d.speed + d.angle) * d.radius,
        1.1 + Math.sin(t * d.speed * 1.3 + d.yOff) * 0.6,
        Math.sin(t * d.speed + d.angle) * d.radius - 0.3
      );
      mesh.rotation.x += 0.02;
      mesh.rotation.y += 0.015;
    });
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 900 || !canvas.clientWidth) return;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}

/* ============================================================
   NAVBAR
============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const icon       = hamburger.querySelector('i');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
  });

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      icon.className = 'fas fa-bars';
    });
  });

  document.getElementById('logo-link').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   SMOOTH SCROLL
============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* ============================================================
   SCROLL-REVEAL (IntersectionObserver)
============================================================ */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal-left, .reveal-up').forEach(el => observer.observe(el));
}

/* ============================================================
   CARD TILT EFFECT (mouse tracking)
============================================================ */
function initTilt() {
  document.querySelectorAll('.service-card, [data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const rx = ((e.clientY - cy) / (r.height / 2)) * -8;
      const ry = ((e.clientX - cx) / (r.width  / 2)) *  8;
      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });
}

/* ============================================================
   TYPEWRITER on hero name
============================================================ */
function initTypewriter() {
  const el = document.querySelector('.hero-name');
  if (!el) return;
  const fullHTML = el.innerHTML;
  el.innerHTML   = '';
  el.style.opacity = 1;

  const temp = document.createElement('div');
  temp.innerHTML = fullHTML;
  const plainParts = [];

  temp.childNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
      plainParts.push({ type: 'text', content: node.textContent });
    } else if (node.tagName === 'SPAN') {
      plainParts.push({ type: 'span', cls: node.className, content: node.textContent });
    }
  });

  let partIdx = 0;
  let charIdx = 0;
  let currentSpan = null;

  function type() {
    if (partIdx >= plainParts.length) return;
    const part = plainParts[partIdx];

    if (part.type === 'text') {
      if (charIdx < part.content.length) {
        el.appendChild(document.createTextNode(part.content[charIdx++]));
        setTimeout(type, 55);
      } else {
        partIdx++; charIdx = 0; currentSpan = null;
        setTimeout(type, 55);
      }
    } else {
      if (!currentSpan) {
        currentSpan = document.createElement('span');
        currentSpan.className = part.cls;
        el.appendChild(currentSpan);
      }
      if (charIdx < part.content.length) {
        currentSpan.textContent += part.content[charIdx++];
        setTimeout(type, 55);
      } else {
        partIdx++; charIdx = 0; currentSpan = null;
        setTimeout(type, 55);
      }
    }
  }

  setTimeout(type, 900);
}

/* ============================================================
   CONTACT FORM
============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const btn  = form.querySelector('.send-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> &nbsp;Sent!';
    btn.style.background = '#22c55e';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML   = orig;
      btn.style.background = '';
      btn.disabled    = false;
      form.reset();
    }, 3500);
  });
}

/* ============================================================
   ACTIVE NAV LINK on scroll
============================================================ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = '#915eff';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   INIT
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initStars();
  initComputerModel();
  initNavbar();
  initSmoothScroll();
  initReveal();
  initTilt();
  initTypewriter();
  initContactForm();
  initActiveNav();
});
