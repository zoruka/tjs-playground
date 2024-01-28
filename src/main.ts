import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';
import { Player } from './player';
import { Actor } from './lib';

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')! as HTMLElement;

// Scene
const scene = new THREE.Scene();
const actors = [] as Actor[];

/**
 * Textures
 */

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 5, 0);
pointLight.decay = 0.8;
pointLight.castShadow = true;
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
scene.add(pointLightHelper);

/**
 * Materials
 */
const groundMaterial = new THREE.MeshStandardMaterial({
	color: 0xaaaaaa,
});

/**
 * Objects
 */
const groundGeometry = new THREE.PlaneGeometry(15, 15);
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.receiveShadow = true;
ground.rotation.x = -Math.PI * 0.5;
scene.add(ground);

const player = new Player();
actors.push(player);
scene.add(player.body);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener('resize', () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.set(10, 10, 10);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let lastElapsedTime = 0;

const tick = () => {
	// Update controls
	controls.update();
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - lastElapsedTime;
	lastElapsedTime = elapsedTime;

	// Update actors
	for (const actor of actors) {
		actor.act({
			deltaTime,
			elapsedTime,
		});
	}

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
