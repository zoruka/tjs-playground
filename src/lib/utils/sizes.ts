import { EventEmitter } from './event-emitter';

type Events = {
	resize: { width: number; height: number };
};

export class Sizes extends EventEmitter<Events> {
	public width: number;
	public height: number;

	constructor(canvas: HTMLCanvasElement) {
		super();

		new ResizeObserver(() => {
			const bounding = canvas.getBoundingClientRect();
			this.width = bounding.width;
			this.height = bounding.height;

			this.emit('resize', { width: this.width, height: this.height });
		}).observe(canvas);
	}
}
