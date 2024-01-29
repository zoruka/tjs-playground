export interface WithAction {
	act(args: WithAction.ActArguments): void;
}

export namespace WithAction {
	export type ActArguments = {
		deltaTime: number;
		elapsedTime: number;
	};
}
