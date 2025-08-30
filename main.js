// Minimal three.js setup: maps a discrete slider (5 slides) to model angles.
// Replace "award.glb" with your exported file.
import * as THREE from 'https://cdn.skypack.dev/three@0.158.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.158.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.158.0/examples/jsm/controls/OrbitControls.js';

// Scene setup
let scene, camera, renderer, controls;
let award = null;
let targetRotation = 0;
let currentRotation = 0;
let isAutoRotating = false;
let autoRotationSpeed = 0.01;

// Slide configuration - 5 discrete angles (72 degrees apart for pentagon-like views)
const slideAngles = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6];
let currentSlide = 0;

// DOM elements
const canvas = document.getElementById('three-canvas');
const slider = document.getElementById('angle-slider');
const slideIndicator = document.getElementById('slide-indicator');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const autoRotateCheck = document.getElementById('auto-rotate');
const loadingDiv = document.getElementById('loading');

// Initialize the 3D scene
function init() {
  console.log('Initializing Three.js scene...');
  
  // Check if Three.js loaded
  if (typeof THREE === 'undefined') {
    console.error('Three.js failed to load');
    document.getElementById('loading').textContent = 'Error: Three.js failed to load';
    return;
  }
  
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);
  console.log('Scene created');
  
  // Camera - positioned to show object on the left side of the canvas
  camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
  camera.position.set(3, 2, 5);
  console.log('Camera created');
  
  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas,
    antialias: true,
    alpha: true 
  });
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  console.log('Renderer created');
  
  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.target.set(-1, 0, 0); // Focus camera on left side
  controls.maxPolarAngle = Math.PI * 0.8;
  controls.minDistance = 2;
  controls.maxDistance = 15;
  
  // Lighting setup
  setupLighting();
  console.log('Lighting setup complete');
  
  // Load the 3D model
  loadModel();
  
  // Setup event listeners
  setupEventListeners();
  console.log('Event listeners setup complete');
  
  // Start render loop
  animate();
  console.log('Animation loop started');
}

function setupLighting() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);
  
  // Main directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 50;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.camera.bottom = -10;
  scene.add(directionalLight);
  
  // Fill light
  const fillLight = new THREE.DirectionalLight(0x8bb6ff, 0.3);
  fillLight.position.set(-5, 2, -5);
  scene.add(fillLight);
  
  // Ground plane for shadows
  const groundGeometry = new THREE.PlaneGeometry(20, 20);
  const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2;
  ground.receiveShadow = true;
  scene.add(ground);
}

function loadModel() {
  const loader = new GLTFLoader();
  
  // Try to load award.glb first, then fallback to a basic geometry if not found
  console.log('Attempting to load award.glb...');
  loader.load(
    'award.glb',
    function(gltf) {
      console.log('SUCCESS: award.glb loaded!');
      // Remove any existing award
      if (award) {
        scene.remove(award);
      }
      
      award = gltf.scene;
      
      // Position the award slightly to the left
      award.position.set(-1.5, 0, 0);
      award.scale.setScalar(1);
      
      // Enable shadows
      award.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Ensure proper material encoding
          if (child.material) {
            child.material.needsUpdate = true;
          }
        }
      });
      
      scene.add(award);
      hideLoading();
      
      console.log('Your award model is now displayed!');
    },
    function(progress) {
      console.log('Loading progress:', (progress.loaded / progress.total * 100) + '%');
    },
    function(error) {
      console.warn('Could not load award.glb:', error);
      console.log('Creating fallback model...');
      createFallbackModel();
      hideLoading();
    }
  );
}

function createFallbackModel() {
  // Create a stylized trophy/award as fallback
  const group = new THREE.Group();
  
  // Trophy cup
  const cupGeometry = new THREE.CylinderGeometry(0.8, 0.6, 1.2, 8);
  const cupMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.2 
  });
  const cup = new THREE.Mesh(cupGeometry, cupMaterial);
  cup.position.y = 0.6;
  cup.castShadow = true;
  cup.receiveShadow = true;
  group.add(cup);
  
  // Trophy base
  const baseGeometry = new THREE.CylinderGeometry(1, 1, 0.3, 8);
  const baseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x8b4513,
    metalness: 0.3,
    roughness: 0.7 
  });
  const base = new THREE.Mesh(baseGeometry, baseMaterial);
  base.position.y = -0.15;
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);
  
  // Trophy handles
  const handleGeometry = new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI);
  const handleMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.2 
  });
  
  const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
  leftHandle.position.set(-0.9, 0.6, 0);
  leftHandle.rotation.z = Math.PI / 2;
  leftHandle.castShadow = true;
  group.add(leftHandle);
  
  const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
  rightHandle.position.set(0.9, 0.6, 0);
  rightHandle.rotation.z = -Math.PI / 2;
  rightHandle.castShadow = true;
  group.add(rightHandle);
  
  // Position the fallback model
  group.position.set(-1.5, 0, 0);
  award = group;
  scene.add(award);
}

function hideLoading() {
  loadingDiv.classList.add('hidden');
}

function setupEventListeners() {
  // Slider change
  slider.addEventListener('input', (e) => {
    currentSlide = parseInt(e.target.value);
    updateTargetRotation();
    updateSlideIndicator();
  });
  
  // Previous/Next buttons
  prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
      currentSlide--;
      slider.value = currentSlide;
      updateTargetRotation();
      updateSlideIndicator();
    }
  });
  
  nextBtn.addEventListener('click', () => {
    if (currentSlide < slideAngles.length - 1) {
      currentSlide++;
      slider.value = currentSlide;
      updateTargetRotation();
      updateSlideIndicator();
    }
  });
  
  // Auto-rotate toggle
  autoRotateCheck.addEventListener('change', (e) => {
    isAutoRotating = e.target.checked;
  });
  
  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && currentSlide > 0) {
      currentSlide--;
      slider.value = currentSlide;
      updateTargetRotation();
      updateSlideIndicator();
    } else if (e.key === 'ArrowRight' && currentSlide < slideAngles.length - 1) {
      currentSlide++;
      slider.value = currentSlide;
      updateTargetRotation();
      updateSlideIndicator();
    }
  });
  
  // Window resize
  window.addEventListener('resize', onWindowResize);
}

function updateTargetRotation() {
  targetRotation = slideAngles[currentSlide];
}

function updateSlideIndicator() {
  slideIndicator.textContent = `Slide ${currentSlide + 1} of ${slideAngles.length}`;
  
  // Update button states
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === slideAngles.length - 1;
}

function onWindowResize() {
  camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
}

function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.update();
  
  if (award) {
    if (isAutoRotating) {
      // Continuous auto-rotation
      award.rotation.y += autoRotationSpeed;
    } else {
      // Smooth interpolation to target rotation
      const rotationDiff = targetRotation - currentRotation;
      
      // Handle angle wrapping (shortest path)
      let adjustedDiff = rotationDiff;
      if (Math.abs(adjustedDiff) > Math.PI) {
        adjustedDiff = adjustedDiff > 0 ? adjustedDiff - Math.PI * 2 : adjustedDiff + Math.PI * 2;
      }
      
      // Smooth interpolation
      currentRotation += adjustedDiff * 0.1;
      award.rotation.y = currentRotation;
    }
  }
  
  // Render
  renderer.render(scene, camera);
}

// Initialize everything when page loads
window.addEventListener('load', () => {
  console.log('Page loaded, initializing 3D viewer...');
  try {
    init();
    updateSlideIndicator();
    console.log('3D viewer initialized successfully');
  } catch (error) {
    console.error('Error initializing 3D viewer:', error);
    // Force fallback model creation
    setTimeout(() => {
      if (!award) {
        console.log('Creating emergency fallback model...');
        createFallbackModel();
        hideLoading();
      }
    }, 1000);
  }
});

// Export for potential external use
export { scene, camera, renderer, award, slideAngles };
