import { Actor, Keypad } from './lib';
import * as THREE from 'three';

export class Player implements Actor {
	keypad: Keypad<Player.Actions> = this.createKeypad();
	body: THREE.Object3D = this.createBody();

	public act({ deltaTime }: Actor.ActArguments): void {
		const speed = 3 * deltaTime;
		if (this.keypad.get('move-forward')) {
			this.body.position.sub(
				new THREE.Vector3(
					Math.sin(this.body.rotation.y),
					0,
					Math.cos(this.body.rotation.y)
				).multiplyScalar(speed)
			);
		}
		if (this.keypad.get('move-backward')) {
			this.body.position.add(
				new THREE.Vector3(
					Math.sin(this.body.rotation.y),
					0,
					Math.cos(this.body.rotation.y)
				).multiplyScalar(speed)
			);
		}
		if (this.keypad.get('move-left')) {
			this.body.rotation.y -= speed;
		}
		if (this.keypad.get('move-right')) {
			this.body.rotation.y += speed;
		}
	}

	private createKeypad(): Keypad<Player.Actions> {
		return new Keypad<Player.Actions>()
			.set('move-forward', ['w', 'ArrowUp'])
			.set('move-backward', ['s', 'ArrowDown'])
			.set('move-left', ['a', 'ArrowLeft'])
			.set('move-right', ['d', 'ArrowRight']);
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
}

export namespace Player {
	export type Actions =
		| 'move-forward'
		| 'move-backward'
		| 'move-left'
		| 'move-right';
}
