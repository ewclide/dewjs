import MegaFunction from './mega-function';

const _timerList = [];

export default class Timer
{
	constructor(settings = {}) {
		this.count = settings.count || 0;
		this.duration = settings.duration || 0;
		this.delay = settings.delay || 0;
		this.step = settings.step || 0;

		this._actions = new MegaFunction(settings.action);
		this._onStart = settings.onStart || null;
		this._onStop = settings.onStop || null;
		this._onFinish = settings._onFinish || null;

		this._pauseStartTime = 0;
		this._startTime = 0;
		this._timePassed = 0;
		this._iteration = 0;

		this._stop = true;
		this._sleepTimeout = null;

		this._init();

		this._tickLimited = this._tickLimited.bind(this);
		this._tickInfinity = this._tickInfinity.bind(this);

		_timerList.push(this);
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

		this.stop();

		return new Promise((resolve) => {
			this._sleepTimeout = setTimeout(() => {
				if (this._startTime) this.start(0);
				resolve();
			}, time);
		});
	}

	start(delay) {
		const wait = typeof delay == 'number' ? delay : this.delay;
		
		if (wait) {
			setTimeout(() => this._start(), wait);
		} else {
			this._start();
		}
	}

	_start() {
		this._stop = false;

		const now = performance.now();

		if (!this._startTime) {
			this._startTime = now;
		} else {
			this._startTime += now - this._pauseStartTime;
		}

		if (typeof this._onStart == 'function') {
			this._onStart(now);
		}

		this[this._tickMethod](this._startTime + this._timePassed);
	}

	stop() {
		this._pauseStartTime = performance.now();
		this._stop = true;

		if (typeof this._onStop == 'function') {
			this._onStop();
		}
	}

	finish() {
		this._stop = true;
		clearTimeout(this._sleepTimeout);

		this._pauseStartTime = 0;
		this._startTime = 0;
		this._timePassed = 0;
		this._iteration = 0;

		if (typeof this._onFinish == 'function') {
			this._onFinish();
		}
	}

	static globalStart() {
		_timerList.forEach((timer) => timer.start());
	}

	static globalStop() {
		_timerList.forEach((timer) => timer.stop());
	}

	static globalFinish() {
		_timerList.forEach((timer) => timer.finish());
	}

	_tickInfinity(time) {
		this._timePassed = time - this._startTime;
		this._actions(this._timePassed);
		this._stop ? this.stop() : requestAnimationFrame(this._tickInfinity);
	}

	_tickInfinityStep() {
		this._timePassed = time - this._startTime;
		this._actions(this._timePassed);

		if (this._stop) {
			this.stop();
		} else {
			setTimeout(() => this._tickInfinityStep(performance.now()), this.step);
		}
	}

	_tickLimited(time) {
		this._timePassed = time - this._startTime;
		this._actions(this._timePassed);

		if (this._timePassed >= this.duration) {
			this._stop = true;
		}

		this._stop ? this.stop() : requestAnimationFrame(this._tickLimited);
	}

	_tickLimitedStep(time) {
		this._timePassed = time - this._startTime;
		this._actions(this._timePassed, this._iteration);

		if (this._iteration++ >= this.count - 1) {
			this._stop = true;
			this._iteration--;
		}

		if (this._stop) {
			this.stop();
		} else {
			setTimeout(() => this._tickLimitedStep(performance.now()), this.step);
		}
	}
}