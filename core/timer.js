import CallBacker from './callbacker';
import { idGetter } from './functions';

const _timerList = new Map();
const getId = idGetter('__timer__');

export default class Timer
{
	constructor(settings = {}) {
		this.id = getId();
		this.count = settings.count || 0;
		this.duration = settings.duration || 0;
		this.delay = settings.delay || 0;
		this.step = settings.step || 0;
		this.flow = settings.flow || 1;

		this._actions = new CallBacker(settings.action);
		this._onPLay = settings.onPLay || null;
		this._onPause = settings.onPause || null;
		this._onFinish = settings._onFinish || null;

		this._prevTime = 0;
		this._pauseTime = 0;
		this._startTime = 0;
		this._elapsedTime = 0;
		this._iteration = 0;

		this._pause = true;
		this._sleepTimeout = null;

		this._init();

		this._tickLimited = this._tickLimited.bind(this);
		this._tickInfinity = this._tickInfinity.bind(this);

		_timerList.set(this.id, this);
	}

	_init() {
		if (this.step && this.duration) {
			this.count = Math.round(this.duration / this.step);
			this.duration = null;
		}
		else if (this.count && this.duration) {
			this.step = this.duration / this.count;
		}

		this._tickMethod = this._getTickMethod();
	}

	_getTickMethod() {
		if (this.step) {
			return this.count ? '_tickLimitedStep' : '_tickInfinityStep';
		} else {
			return this.duration ? '_tickLimited' : '_tickInfinity';
		}
	}

	addAction(action) {
		this._actions.push(action);
		return this;
	}

	clearActions() {
        this._action.clear();
    }

	sleep(time) {
		clearTimeout(this._sleepTimeout);

		this.pause();

		return new Promise((resolve) => {
			this._sleepTimeout = setTimeout(() => {
				if (this._startTime) this.play(0);
				resolve();
			}, time);
		});
	}

	play(delay) {
		const wait = typeof delay == 'number' ? delay : this.delay;

		if (wait) {
			setTimeout(() => this._play(), wait);
		} else {
			this._play();
		}
	}

	_play() {
		this._pause = false;

		const now = performance.now();
		this._prevTime = now;

		if (!this._startTime) {
			this._startTime = now;
		} else {
			this._startTime += now - this._pauseTime;
		}

		if (typeof this._onPLay == 'function') {
			this._onPLay(now);
		}

		requestAnimationFrame(() => {
			this[this._tickMethod](this._startTime + this._elapsedTime / this.flow);
		});
	}

	pause() {
		this._pauseTime = performance.now();
		this._pause = true;

		if (typeof this._onPause == 'function') {
			this._onPause();
		}
	}

	finish() {
		clearTimeout(this._sleepTimeout);

		this._pause = true;
		this._prevTime = 0;
		this._pauseTime = 0;
		this._startTime = 0;
		this._elapsedTime = 0;
		this._iteration = 0;

		if (typeof this._onFinish == 'function') {
			this._onFinish();
		}
	}

	destroy() {
		_timerList.delete(this.id);
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
		const dt = (time - this._prevTime) / 1000 * this.flow;

		this._prevTime = time;
		this._elapsedTime = (time - this._startTime) * this.flow;
		this._actions.call(dt, this._elapsedTime);

		if (this._pause) {
			this.pause();
		} else {
			requestAnimationFrame(this._tickInfinity);
		}
	}

	_tickInfinityStep(time) {
		const dt = (time - this._prevTime) / 1000 * this.flow;

		this._prevTime = time;
		this._elapsedTime = (time - this._startTime) * this.flow;
		this._actions.call(dt, this._elapsedTime);

		if (this._pause) {
			this.pause();
		} else {
			setTimeout(() => this._tickInfinityStep(performance.now()), this.step);
		}
	}

	_tickLimited(time) {
		const dt = (time - this._prevTime) / 1000 * this.flow;

		this._prevTime = time;
		this._elapsedTime = (time - this._startTime) * this.flow;
		this._actions.call(dt, this._elapsedTime);

		if (this._elapsedTime >= this.duration) {
			this._pause = true;
		}

		if (this._pause) {
			this.pause();
		} else {
			requestAnimationFrame(this._tickLimited);
		}
	}

	_tickLimitedStep(time) {
		const dt = (time - this._prevTime) / 1000 * this.flow;

		this._prevTime = time;
		this._elapsedTime = (time - this._startTime) * this.flow;
		this._actions.call(dt, this._elapsedTime, this._iteration);

		if (this._iteration++ >= this.count - 1) {
			this._pause = true;
			this._iteration--;
		}

		if (this._pause) {
			this.pause();
		} else {
			setTimeout(() => this._tickLimitedStep(performance.now()), this.step);
		}
	}
}