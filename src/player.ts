import { WithAction, Keypad, Actor } from '@/lib';
import * as THREE from 'three';
import SSP from 'ss-physics';

export class Player implements Actor {
	keypad: Keypad<Player.Actions> = this.createKeypad();
	body: THREE.Object3D;
	physic: SSP.Body;

	constructor() {
		this.body = this.createBody();
		this.physic = this.createPhysic();
	}

	public act({ deltaTime }: WithAction.ActArguments): void {
		const speed = 3 * deltaTime;
		if (this.keypad.get('move-forward')) {
			this.physic.applyForce(
				new THREE.Vector3(
					Math.sin(this.body.rotation.y),
					0,
					Math.cos(this.body.rotation.y)
				).multiplyScalar(speed)
			);
		}
		if (this.keypad.get('move-backward')) {
			this.physic.applyForce(
				new THREE.Vector3(
					Math.sin(this.body.rotation.y),
					0,
					Math.cos(this.body.rotation.y)
				)
					.multiplyScalar(speed)
					.negate()
			);
		}
		if (this.keypad.get('move-left')) {
			this.body.rotation.y -= speed;
		}
		if (this.keypad.get('move-right')) {
			this.body.rotation.y += speed;
		}
	}

	private createBody(): THREE.Object3D {
		const elementMaterial = new THREE.MeshStandardMaterial({
			color: 0x00ff00,
		});

		const cubeGeometry = new THREE.BoxGeometry(1, 2, 0.5);
		const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32);
		sphereGeometry.translate(0, 1.25, 0);

		const body = new THREE.Group();
		body.add(new THREE.Mesh(cubeGeometry, elementMaterial));
		body.add(new THREE.Mesh(sphereGeometry, elementMaterial));
		body.position.y = 1;
		body.children.forEach((child) => {
			child.castShadow = true;
			child.receiveShadow = true;
		});
		body.castShadow = true;

		return body;
	}

	private createKeypad(): Keypad<Player.Actions> {
		return new Keypad<Player.Actions>()
			.set('move-forward', ['w', 'ArrowUp'])
			.set('move-backward', ['s', 'ArrowDown'])
			.set('move-left', ['a', 'ArrowLeft'])
			.set('move-right', ['d', 'ArrowRight']);
	}

	private createPhysic(): SSP.Body {
		return new SSP.Body({
			position: this.body.position,
			mass: 1,
		});
	}
}

export namespace Player {
	export type Actions =
		| 'move-forward'
		| 'move-backward'
		| 'move-left'
		| 'move-right';
}
