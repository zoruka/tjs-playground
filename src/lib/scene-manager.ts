import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Actor } from './interfaces/actor';
import SSP from 'ss-physics';
import { Sizes } from './utils/sizes';

export class SceneManager {
	private readonly scene: THREE.Scene;
	public readonly camera: THREE.PerspectiveCamera;
	private readonly renderer: THREE.WebGLRenderer;
	private readonly clock: THREE.Clock;
	private readonly actors: Actor[] = [];
	private readonly controls: OrbitControls;
	private readonly pWorld: SSP.World;
	private readonly sizes: Sizes;

	private lastElapsedTime = 0;

	constructor(args: SceneManager.ConstructorArguments) {
		this.sizes = new Sizes(args.canvas);

		this.camera = new THREE.PerspectiveCamera(
			75,
			this.sizes.width / this.sizes.height,
			0.1,
			100
		);

		this.renderer = new THREE.WebGLRenderer({
			canvas: args.canvas,
			antialias: true,
		});

		this.scene = new THREE.Scene();
		this.clock = new THREE.Clock(false);
		this.controls = new OrbitControls(this.camera, args.canvas);

		this.pWorld = new SSP.World({ gravity: 0 });

		this.sizes.on('resize', ({ width, height }) => {
			console.log('resizeCallback', { width, height });

			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();

			this.renderer.setSize(width, height);
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
	};
}
