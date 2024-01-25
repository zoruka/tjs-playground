import THREE from 'three';
import JOLT from 'jolt-physics';

export class Vector {
	private _graphics: THREE.Vector3;
	private _physics: JOLT.Vec3;
	private _x: number;
	private _y: number;
	private _z: number;

	constructor(args: Vector.Constructor) {
		if (args instanceof JOLT.Vec3) {
			this._x = args.GetX();
			this._y = args.GetY();
			this._z = args.GetZ();
			this._graphics = new THREE.Vector3(this._x, this._y, this._z);
			this._physics = args;
		} else if (args instanceof THREE.Vector3) {
			this._x = args.x;
			this._y = args.y;
			this._z = args.z;
			this._graphics = args;
			this._physics = new JOLT.Vec3(this._x, this._y, this._z);
		} else {
			this._x = args.x ?? 0;
			this._y = args.y ?? 0;
			this._z = args.z ?? 0;
			this._graphics = new THREE.Vector3(this._x, this._y, this._z);
			this._physics = new JOLT.Vec3(this._x, this._y, this._z);
		}
	}

	get physics() {
		return this._physics;
	}

	set physics(vec: JOLT.Vec3) {
		this._x = vec.GetX();
		this._y = vec.GetY();
		this._z = vec.GetZ();

		this._graphics.set(this._x, this._y, this._z);
	}

	get graphics() {
		return this._graphics;
	}

	set graphics(vec: THREE.Vector3) {
		this._x = vec.x;
		this._y = vec.y;
		this._z = vec.z;

		this._physics.Set(this._x, this._y, this._z);
	}

	get x() {
		return this._x;
	}

	set x(x: number) {
		this._x = x;
		this._graphics.x = x;
		this._physics.SetX(x);
	}

	get y() {
		return this._y;
	}

	set y(y: number) {
		this._y = y;
		this._graphics.y = y;
		this._physics.SetY(y);
	}

	get z() {
		return this._z;
	}

	set z(z: number) {
		this._z = z;
		this._graphics.z = z;
		this._physics.SetZ(z);
	}

	set(x: number, y: number, z: number) {
		this._x = x;
		this._y = y;
		this._z = z;
		this._graphics.set(x, y, z);
		this._physics.Set(x, y, z);
	}
}

export namespace Vector {
	export type ObjectConstructor = {
		x?: number;
		y?: number;
		z?: number;
	};

	export type PhysicsConstructor = JOLT.Vec3;

	export type GraphicsConstructor = THREE.Vector3;

	export type Constructor =
		| ObjectConstructor
		| PhysicsConstructor
		| GraphicsConstructor;
}
