import JOLT from 'jolt-physics';
import { Vector } from './vector';

const LAYER_NON_MOVING = 0;
const LAYER_MOVING = 1;
const NUM_OBJECT_LAYERS = 2;
const NUM_BROAD_PHASE_LAYERS = 2;
const NOT_INITIALIZED_ERROR = new Error('Physics not initialized');

export class Physics {
	private jolt: JOLT.JoltInterface | null = null;
	private bodyInterface: JOLT.BodyInterface | null = null;
	private physicsSystem: JOLT.PhysicsSystem | null = null;

	async init() {
		const Jolt = await JOLT();
		const settings = new Jolt.JoltSettings();

		let objectFilter = new Jolt.ObjectLayerPairFilterTable(
			NUM_OBJECT_LAYERS
		);
		objectFilter.EnableCollision(LAYER_NON_MOVING, LAYER_MOVING);
		objectFilter.EnableCollision(LAYER_MOVING, LAYER_MOVING);

		const BP_LAYER_NON_MOVING = new Jolt.BroadPhaseLayer(0);
		const BP_LAYER_MOVING = new Jolt.BroadPhaseLayer(1);
		let bpInterface = new Jolt.BroadPhaseLayerInterfaceTable(
			NUM_OBJECT_LAYERS,
			NUM_BROAD_PHASE_LAYERS
		);
		bpInterface.MapObjectToBroadPhaseLayer(
			LAYER_NON_MOVING,
			BP_LAYER_NON_MOVING
		);
		bpInterface.MapObjectToBroadPhaseLayer(LAYER_MOVING, BP_LAYER_MOVING);

		settings.mObjectLayerPairFilter = objectFilter;
		settings.mBroadPhaseLayerInterface = bpInterface;
		settings.mObjectVsBroadPhaseLayerFilter =
			new Jolt.ObjectVsBroadPhaseLayerFilterTable(
				settings.mBroadPhaseLayerInterface,
				NUM_BROAD_PHASE_LAYERS,
				settings.mObjectLayerPairFilter,
				NUM_OBJECT_LAYERS
			);

		this.jolt = new Jolt.JoltInterface(settings);
		this.physicsSystem = this.jolt.GetPhysicsSystem();
		this.bodyInterface = this.physicsSystem.GetBodyInterface();

		Jolt.destroy(settings);

		return this;
	}

	tick(deltaTime: number) {
		if (!this.jolt) {
			throw NOT_INITIALIZED_ERROR;
		}

		// When running below 55 Hz, do 2 steps instead of 1
		var numSteps = deltaTime > 1.0 / 55.0 ? 2 : 1;

		// Step the physics world
		this.jolt.Step(deltaTime, numSteps);
	}

	createBox(
		position: Vector,
		rotation,
		halfExtent,
		motionType,
		layer,
		color = 0xffffff
	) {
		if (!this.jolt || !this.bodyInterface) {
			throw NOT_INITIALIZED_ERROR;
		}

		const shape = new JOLT.BoxShape(halfExtent, 0.05);
		const creationSettings = new JOLT.BodyCreationSettings(
			shape,
			position.physics,
			rotation,
			motionType,
			layer
		);
		const body = this.bodyInterface.CreateBody(creationSettings);
		JOLT.destroy(creationSettings);

		return body;
	}
}
