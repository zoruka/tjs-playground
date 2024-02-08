import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Actor } from './interfaces/actor';
import SSP from 'ss-physics';

export class SceneManager {
	private readonly scene: THREE.Scene;
	private readonly camera: THREE.PerspectiveCamera;
	private readonly renderer: THREE.WebGLRenderer;
	private readonly clock: THREE.Clock;
	private readonly actors: Actor[] = [];
	private readonly controls: OrbitControls;
	private readonly pWorld: SSP.World;

	private lastElapsedTime = 0;

	constructor(args: SceneManager.ConstructorArguments) {
		this.camera = args.camera;
		this.renderer = args.renderer;

		this.scene = new THREE.Scene();
		this.clock = new THREE.Clock(false);
		this.controls = new OrbitControls(this.camera, args.canvas);

		this.pWorld = new SSP.World({ gravity: 0.01 });

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

	public addActor(actor: Actor): void {
		this.scene.add(actor.body);
		this.actors.push(actor);
		this.pWorld.addBody(actor.physic);
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
		this.pWorld.update(deltaTime);

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
