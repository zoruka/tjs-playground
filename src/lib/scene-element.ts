export abstract class SceneElement {
	body: THREE.Object3D;

	constructor() {
		this.body = this.createBody();
	}

	protected abstract createBody(): THREE.Object3D;
}
