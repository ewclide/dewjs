import Callbacker from './callbacker';

const _timerList = new Set();

export class Time {
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

export class Clock {
	constructor(settings = {}) {
		const { count = 0, duration = 0, delay = 0, step = 0, timeScale = 1 } = settings;
		this._count = count;
		this._duration = duration;
		this._delay = delay;
		this._step = step;
		this._timeScale = timeScale;

		const { onUpdate, onPlay, onPause, onStart, onFinish } = settings;
		this._onUpdate = new Callbacker(onUpdate);
		this._onPlay = new Callbacker(onPlay);
		this._onPause = new Callbacker(onPause);
		this._onStart = new Callbacker(onStart);
		this._onFinish = new Callbacker(onFinish);

		this._time = null;
		this._iteration = 0;
		this._paused = true;
		this._asleep = false;
		this._tickMethod = null;
		this._sleepTimeout = null;

		this._init();
	}

	get time() {
		return this._time;
	}

	get iteration() {
		return this._iteration;
	}

	_init() {
		if (this._step && this._duration) {
			this._count = Math.round(this._duration / this._step);
			this._duration = 0;
		} else if (this._count && this._duration) {
			this._step = this._duration / this._count;
		}

		this._tickMethod = this._getTickMethod();
		this._time = new Time(this._timeScale);

		_timerList.add(this);
	}

	_getTickMethod() {
		if (this._step) {
			return this._count ? this._tickLimitedStep : this._tickInfinityStep;
		} else {
			return this._duration ? this._tickLimited : this._tickInfinity;
		}
	}

	getTime(time) {
		return time * this._timeScale * 1000;
	}

	onPLay(handler) {
		this._onPLay.push(handler);
		return this;
	}

	onPause(handler) {
		this._onPause.push(handler);
		return this;
	}

	onStart(handler) {
		this._onStart.push(handler);
		return this;
	}

	onFinish(handler) {
		this._onFinish.push(handler);
		return this;
	}

	onUpdate(handler) {
		this._onUpdate.push(handler);
		return this;
	}

	clearUpdates() {
        this._onUpdate.clear();
	}

	setTimeScale(scale) {
		this._time.scale = scale;
		this._timeScale = scale;
	}

	sleep(time) {
		if (this._asleep) {
			console.warn("Can't sleep the clock - it's sleeping now!");
			return;
		}

		this.pause();
		this._asleep = true;

		return new Promise((resolve) => {
			this._sleepTimeout = setTimeout(() => {
				this._asleep = false;
				this.play();
				resolve();
			}, this.getTime(time));
		});
	}

	play(delay) {
		const wait = typeof delay === 'number' ? delay : this._delay;

		if (wait) {
			setTimeout(() => this._play(), this.getTime(wait));
		} else {
			this._play();
		}
	}

	_play() {
		this._paused = false;
		const { elapsed } = this._time;

		if (!elapsed) {
			this._onStart.call();
		} else {
			this._onPlay.call();
		}

		this._time.unfreeze();
		requestAnimationFrame(this._tickMethod);
	}

	pause() {
		this._paused = true;
		this._onPause.call();
		this._time.freeze();
	}

	finish() {
		clearTimeout(this._sleepTimeout);

		this._paused = true;
		this._time.reset();

		this._onFinish.call();
	}

	destroy() {
		this._paused = true;
		_timerList.delete(this);
	}

	_tickInfinity = () => {
		if (this._paused) return;

		this._time.update();

		const { delta, elapsed } = this._time;
		this._onUpdate.call(delta, elapsed);

		requestAnimationFrame(this._tickInfinity);
	}

	_tickInfinityStep = () => {
		if (this._paused) return;

		this._time.update();

		const { delta, elapsed } = this._time;
		this._onUpdate.call(delta, elapsed);

		setTimeout(this._tickInfinityStep, this.getTime(this._step));
	}

	_tickLimited = () => {
		if (this._paused) return;

		this._time.update();

		const { delta, elapsed } = this._time;
		this._onUpdate.call(delta, elapsed);

		if (elapsed >= this._duration) {
			this.finish();
		}

		requestAnimationFrame(this._tickLimited);
	}

	_tickLimitedStep = () => {
		if (this._paused) return;

		this._time.update();

		const { delta, elapsed } = this._time;
		this._onUpdate.call(delta, elapsed, this._iteration);

		if (this._iteration++ >= this._count - 1) {
			this.finish();
		}

		setTimeout(this._tickLimitedStep, this.getTime(this._step));
	}

	static play() {
		_timerList.forEach((timer) => timer.play());
	}

	static pause() {
		_timerList.forEach((timer) => timer.pause());
	}

	static finish() {
		_timerList.forEach((timer) => timer.finish());
	}

	static clear() {
		_timerList.clear();
	}
}