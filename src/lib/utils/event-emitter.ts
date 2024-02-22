type EventHandler<Argument> = (arg: Argument) => void;

export abstract class EventEmitter<Events extends {}> {
	listeners: {
		[Key in keyof Events]?: EventHandler<Events[Key]>[];
	} = {};

	on<Key extends keyof Events>(
		event: Key,
		listener: EventHandler<Events[Key]>
	): void {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}

		this.listeners[event].push(listener);
	}

	off<Key extends keyof Events>(
		event: Key,
		listener: EventHandler<Events[Key]>
	): void {
		if (!this.listeners[event]) {
			return;
		}

		const index = this.listeners[event].indexOf(listener);
		if (index !== -1) {
			this.listeners[event].splice(index, 1);
		}
	}

	emit<Key extends keyof Events>(event: Key, arg: Events[Key]): void {
		if (!this.listeners[event]) {
			return;
		}

		for (const listener of this.listeners[event]) {
			listener(arg);
		}
	}

	clearEvent<Key extends keyof Events>(event: Key): void {
		if (!this.listeners[event]) {
			return;
		}
		this.listeners[event] = [];
	}

	clear(): void {
		this.listeners = {};
	}
}
