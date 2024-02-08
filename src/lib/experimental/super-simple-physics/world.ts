import * as THREE from 'three';
import { Body } from './body';

export class World {
	gravity: number;
	private bodies: Body[];

	constructor(args: World.ConstructorArguments) {
		this.gravity = args.gravity;
		this.bodies = [];
	}

	addBody(body: Body) {
		this.bodies.push(body);
	}

	update(deltaTime: number) {
		for (const body of this.bodies) {
			body.applyForce(new THREE.Vector3(0, -this.gravity * body.mass, 0));

			body.position.add(body.velocity.clone().multiplyScalar(deltaTime));
		}
	}
}

export namespace World {
	export type ConstructorArguments = {
		gravity: number;
	};
}
