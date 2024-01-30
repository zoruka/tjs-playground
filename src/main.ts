import './style.css';
import * as THREE from 'three';
import GUI from 'lil-gui';
import { Player } from './player';
import { Enemy } from './enemy';
import { createSceneManager } from './create-scene-manager';

/**
 * Base
 */
// Debug
const gui = new GUI();

const sceneManager = createSceneManager();

/**
 * Textures
 */

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
sceneManager.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 5, 0);
pointLight.decay = 0.8;
pointLight.castShadow = true;
sceneManager.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
sceneManager.add(pointLightHelper);

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
sceneManager.add(ground);

const player = new Player();
sceneManager.addActor(player);

const enemy = new Enemy(player);
sceneManager.addActor(enemy);

sceneManager.start();
