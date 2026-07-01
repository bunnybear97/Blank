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

  const loadingEl = document.getElementById('model-loading');

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(25, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.set(20, 3, 5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;

  // Lighting — matches the reference scene
  scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.15));

  const spotLight = new THREE.SpotLight(0xffffff, 1);
  spotLight.position.set(-20, 50, 10);
  spotLight.angle = 0.12;
  spotLight.penumbra = 1;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(1024, 1024);
  scene.add(spotLight);

  scene.add(new THREE.PointLight(0xffffff, 1));

  // Drag to spin horizontally, like the reference (no zoom, no vertical tilt)
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  controls.target.set(0, 0, 0);

  const loader = new THREE.GLTFLoader();
  loader.load(
    'desktop_pc/scene.gltf',
    gltf => {
      const computer = gltf.scene;
      computer.scale.set(0.75, 0.75, 0.75);
      computer.position.set(0, -3.25, -1.5);
      computer.rotation.set(-0.01, -0.2, -0.1);
      scene.add(computer);
      if (loadingEl) loadingEl.classList.add('hidden');
    },
    undefined,
    err => {
      console.error('Failed to load 3D model:', err);
      if (loadingEl) loadingEl.classList.add('hidden');
    }
  );

  (function animate() {
    requestAnimationFrame(animate);
    controls.update();
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
