import * as THREE from 'three';

export class Body {
	mass: number;
	position: THREE.Vector3;

	velocity = new THREE.Vector3(0, 0, 0);

	constructor(args: Body.ConstructorArguments) {
		this.mass = args.mass;
		this.position = args.position;
	}

	applyForce(force: THREE.Vector3) {
		const acceleration = force.clone().divideScalar(this.mass);
		this.velocity.add(acceleration);
	}
}

export namespace Body {
	export type ConstructorArguments = {
		mass: number;
		position: THREE.Vector3;
	};
}
