import * as THREE from 'three';
import { WithBody, WithAction } from './lib';

export class Enemy implements WithAction, WithBody {
	body: THREE.Object3D;

	constructor(private player: WithBody) {
		this.body = this.createBody();
	}

	public act({ deltaTime }: WithAction.ActArguments): void {
		const enemySpeed = 2 * deltaTime;

		const direction = new THREE.Vector3(
			this.player.body.position.x - this.body.position.x,
			0,
			this.player.body.position.z - this.body.position.z
		).normalize();

		const enemyDirection = new THREE.Vector3(
			Math.sin(this.body.rotation.y),
			0,
			Math.cos(this.body.rotation.y)
		).normalize();

		const angleToRotate = direction.angleTo(enemyDirection);
		const rotationSense = enemyDirection.cross(direction).y > 0 ? 1 : -1;
		this.body.rotation.y += rotationSense * angleToRotate * enemySpeed;
		this.body.position.add(
			new THREE.Vector3(
				Math.sin(this.body.rotation.y),
				0,
				Math.cos(this.body.rotation.y)
			).multiplyScalar(enemySpeed)
		);
	}

	protected createBody(): THREE.Object3D {
		const body = new THREE.Mesh(
			new THREE.BoxGeometry(0.5, 0.5, 0.5),
			new THREE.MeshStandardMaterial({ color: 0xff0000 })
		);
		body.castShadow = true;
		body.receiveShadow = true;

		const head = new THREE.Mesh(
			new THREE.BoxGeometry(0.25, 0.25, 0.25).translate(0, 0.25, 0.25),
			new THREE.MeshStandardMaterial({ color: 0xffffff })
		);
		head.castShadow = true;
		head.receiveShadow = true;

		const enemy = new THREE.Group();
		enemy.add(body);
		enemy.add(head);

		enemy.position.x = 5;
		enemy.position.z = 5;
		enemy.position.y = 0.25;

		return enemy;
	}
}
