export class Keypad<Action = string> {
	private records = new Map<Action, Keypad.Record>();

	public set(action: Action, keys: string[]): this {
		if (this.records.has(action)) {
			this.records.delete(action);
		}

		const keydown = (event: KeyboardEvent) => {
			const record = this.records.get(action)!;

			if (record.disabled) return;

			if (!record.keys.includes(event.key)) return;

			record.state = true;
		};

		const keyup = (event: KeyboardEvent) => {
			const record = this.records.get(action)!;

			if (!record.keys.includes(event.key)) return;

			record.state = false;
		};

		window.addEventListener('keydown', keydown);
		window.addEventListener('keyup', keyup);

		this.records.set(action, {
			state: false,
			disabled: false,
			keys,
			keydown,
			keyup,
		});

		return this;
	}

	public remove(action: Action): this {
		const record = this.records.get(action);

		if (!record) {
			console.warn(`Action "${action}" not found in Keypad`);
			return this;
		}

		window.removeEventListener('keydown', record.keydown);
		window.removeEventListener('keyup', record.keyup);

		this.records.delete(action);

		return this;
	}

	public enable(action: Action): this {
		const record = this.records.get(action);

		if (!record) {
			console.warn(`Action "${action}" not found in Keypad`);
			return this;
		}

		record.disabled = false;

		return this;
	}

	public disable(action: Action): this {
		const record = this.records.get(action);

		if (!record) {
			console.warn(`Action "${action}" not found in Keypad`);
			return this;
		}

		record.disabled = true;

		return this;
	}

	public get(action: Action): boolean {
		const record = this.records.get(action);

		if (record === undefined) {
			console.warn(`Action "${action}" not found in Keypad`);
			return false;
		}

		return record.state;
	}
}

export namespace Keypad {
	export type Record = {
		state: boolean;
		disabled: boolean;
		keys: string[];
		keydown: (event: KeyboardEvent) => void;
		keyup: (event: KeyboardEvent) => void;
	};
}
