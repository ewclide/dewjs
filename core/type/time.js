export default class Time {
    constructor(scale = 1) {
        this._time = performance.now();
        this._delta = 0;
        this._elapsed = 0;
		this._scale = scale;
		this._freezed = false;
    }

    get elapsed() {
        return this._elapsed;
    }

    get delta() {
        return this._delta;
    }

    get scale() {
        return this._scale;
	}

	get freezed() {
		return this._freezed;
	}

    set scale(scale) {
        if (typeof scale !== 'number') return;
        this._scale = scale;
    }

    reset() {
        this._time = performance.now();
        this._elapsed = 0;
        this._delta = 0;
        this._scale = 1;
	}

	freeze() {
		this._freezed = true;
	}

	unfreeze() {
		this._freezed = false;
		this._time = performance.now();
	}

    update() {
        const now = this._freezed ? this._time : performance.now();

        this._delta = (now - this._time) * this._scale * 0.001;
        this._elapsed += this._delta;
        this._time = now;
	}

	static parse(time) { // seconds
		let t = time;

		const h = Math.floor(t / 3600); t -= h * 3600;
		const m = Math.floor(t / 60); t -= m * 60;
		const s = Math.floor(t); t -= s;
		const ms = Math.floor(t * 1000);

		return [h, m, s, ms];
	}
}