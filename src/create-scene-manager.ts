import { SceneManager } from './lib';
import * as THREE from 'three';

const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

export const createSceneManager = (): SceneManager => {
	const canvas = document.querySelector('canvas.webgl')! as HTMLCanvasElement;

	const renderer = new THREE.WebGLRenderer({
		canvas: document.querySelector('canvas.webgl')! as HTMLElement,
		antialias: true,
	});
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

	const camera = new THREE.PerspectiveCamera(
		75,
		sizes.width / sizes.height,
		0.1,
		100
	);
	camera.position.set(10, 10, 10);

	return new SceneManager({
		camera,
		renderer,
		canvas,
		sizes,
	});
};
