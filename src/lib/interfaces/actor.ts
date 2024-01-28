export interface Actor {
	act(args: Actor.ActArguments): void;
}

export namespace Actor {
	export type ActArguments = {
		deltaTime: number;
		elapsedTime: number;
	};
}
