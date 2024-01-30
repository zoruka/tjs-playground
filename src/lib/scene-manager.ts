import * as THREE from 'three';
import { WithAction, WithBody } from './interfaces';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
	private readonly scene: THREE.Scene;
	private readonly camera: THREE.PerspectiveCamera;
	private readonly renderer: THREE.WebGLRenderer;
	private readonly clock: THREE.Clock;
	private readonly actors: WithAction[] = [];
	private readonly controls: OrbitControls;

	private lastElapsedTime = 0;

	constructor(args: SceneManager.ConstructorArguments) {
		this.camera = args.camera;
		this.renderer = args.renderer;

		this.scene = new THREE.Scene();
		this.clock = new THREE.Clock(false);
		this.controls = new OrbitControls(this.camera, args.canvas);

		window.addEventListener('resize', () => {
			// Update sizes
			args.sizes.width = window.innerWidth;
			args.sizes.height = window.innerHeight;

			// Update camera
			this.camera.aspect = args.sizes.width / args.sizes.height;
			this.camera.updateProjectionMatrix();

			// Update renderer
			this.renderer.setSize(args.sizes.width, args.sizes.height);
			this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		});
	}

	public start(): void {
		this.lastElapsedTime = 0;
		this.clock.start();
		this.tick();
	}

	public add(element: THREE.Object3D): void {
		this.scene.add(element);
	}

	public addActor(actor: WithAction & WithBody): void {
		this.scene.add(actor.body);
		this.actors.push(actor);
	}

	private tick() {
		this.controls.update();

		const elapsedTime = this.clock.getElapsedTime();
		const deltaTime = this.clock.elapsedTime - this.lastElapsedTime;
		this.lastElapsedTime = elapsedTime;

		for (const actor of this.actors) {
			actor.act({ deltaTime, elapsedTime });
		}

		this.renderer.render(this.scene, this.camera);

		window.requestAnimationFrame(this.tick.bind(this));
	}
}

export namespace SceneManager {
	export type ConstructorArguments = {
		canvas: HTMLCanvasElement;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		sizes: {
			width: number;
			height: number;
		};
	};
}
