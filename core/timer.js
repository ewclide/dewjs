import Callbacker from './callbacker';

const _timerList = new Set();

export default class Timer {
	constructor(settings = {}) {
		// common
		const { count = 0, duration = 0, delay = 0, step = 0, flow = 1 } = settings;
		this._count = count;
		this._duration = duration;
		this._delay = delay;
		this._step = step;
		this._flow = flow;

		// callbacks
		const { onUpdate, onPlay, onPause, onStart, onFinish } = settings;
		this._onUpdate = new Callbacker(onUpdate);
		this._onPlay = new Callbacker(onPlay);
		this._onPause = new Callbacker(onPause);
		this._onStart = new Callbacker(onStart);
		this._onFinish = new Callbacker(onFinish);

		// specials
		this._prevTime = 0;
		this._elapsedTime = 0;
		this._iteration = 0;
		this._paused = true;
		this._asleep = false;
		this._timeRate = flow / 1000;
		this._tickMethod = null;

		this._tickLimitedStep = this._tickLimitedStep.bind(this); 
		this._tickInfinityStep = this._tickInfinityStep.bind(this);
		this._tickLimited = this._tickLimited.bind(this);
		this._tickInfinity = this._tickInfinity.bind(this);

		this._init();
	}

	get elapsed() {
		return this._elapsedTime;
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
		_timerList.add(this);
	}

	_getTickMethod() {
		if (this._step) {
			return this._count ? this._tickLimitedStep : this._tickInfinityStep;
		} else {
			return this._duration ? this._tickLimited : this._tickInfinity;
		}
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

	clearActions() {
        this._onUpdate.clear();
	}

	setFlow(flow) {
		this._flow = flow;
		this._timeRate = flow / 1000;
	}

	sleep(time) {
		if (this._asleep) {
			console.warn("Can't sleep timer, it is sleeping now!");
			return;
		}

		this.pause();
		this._asleep = true;

		return new Promise((resolve) => {
			setTimeout(() => {
				this._asleep = false;
				this.play();
				resolve();
			}, time / this._timeRate);
		});
	}

	play(delay) {
		const wait = typeof delay == 'number' ? delay : this.delay;

		if (wait) {
			setTimeout(() => this._play(), wait / this._timeRate);
		} else {
			this._play();
		}
	}

	_play() {
		this._paused = false;
		this._prevTime = performance.now();

		if (!this._elapsedTime) {
			this._onStart.call();
		} else {
			this._onPlay.call();
		}

		requestAnimationFrame(() => this._tickMethod(this._prevTime));
	}

	pause() {
		this._paused = true;
		this._onPause.call();
	}

	finish() {
		clearTimeout(this._sleepTimeout);

		this._paused = true;
		this._prevTime = 0;
		this._elapsedTime = 0;
		this._iteration = 0;

		this._onFinish.call();
	}

	destroy() {
		this._paused = true;
		_timerList.delete(this);
	}

	static parse(time) { // sec
		let t = time;

		const h = Math.floor(t / 3600); t -= h * 3600;
		const m = Math.floor(t / 60); t -= m * 60;
		const s = Math.floor(t); t -= s;
		const ms = Math.floor(t * 1000);

		return [h, m, s, ms];
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

	_tickInfinity(time) {
		const deltaTime = (time - this._prevTime) * this._timeRate;

		this._prevTime = time;
		this._elapsedTime += deltaTime;
		this._onUpdate.call(deltaTime, this._elapsedTime);

		if (!this._paused) {
			requestAnimationFrame(this._tickInfinity);
		}
	}

	_tickInfinityStep(time) {
		const deltaTime = (time - this._prevTime) * this._timeRate;

		this._prevTime = time;
		this._elapsedTime += deltaTime;
		this._onUpdate.call(deltaTime, this._elapsedTime);

		if (!this._paused) {
			setTimeout(() => this._tickInfinityStep(performance.now()),
				this._step / this._timeRate);
		}
	}

	_tickLimited(time) {
		const deltaTime = (time - this._prevTime) * this._timeRate;

		this._prevTime = time;
		this._elapsedTime += deltaTime;
		this._onUpdate.call(deltaTime, this._elapsedTime);

		if (this._elapsedTime >= this._duration) {
			this.finish();
		}

		if (!this._paused) {
			requestAnimationFrame(this._tickLimited);
		}
	}

	_tickLimitedStep(time) {
		const deltaTime = (time - this._prevTime) * this._timeRate;

		this._prevTime = time;
		this._elapsedTime += deltaTime;
		this._onUpdate.call(deltaTime, this._elapsedTime, this._iteration);

		if (this._iteration++ >= this._count - 1) {
			this.finish();
		}

		if (!this._paused) {
			setTimeout(() => this._tickLimitedStep(performance.now()),
				this._step / this._timeRate);
		}
	}
}