import { SceneManager } from './lib';
import * as THREE from 'three';

export const createSceneManager = (): SceneManager => {
	const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement;

	const sceneManager = new SceneManager({
		canvas,
	});

	sceneManager.camera.position.set(10, 10, 10);
	return sceneManager;
};
