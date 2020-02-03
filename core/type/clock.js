import log from '../helper/log';
import Callback from './callback';
import Time from './time';

const _timerList = new Set();

export default class Clock {
	constructor(settings = {}) {
		const { count = 0, duration = 0, delay = 0, step = 0, timeScale = 1 } = settings;
		this._count = count;
		this._duration = duration;
		this._delay = delay;
		this._step = step;
		this._timeScale = timeScale;

		const { onUpdate, onPlay, onPause, onStart, onFinish } = settings;
		this._onUpdate = new Callback(onUpdate);
		this._onPlay = new Callback(onPlay);
		this._onPause = new Callback(onPause);
		this._onStart = new Callback(onStart);
		this._onFinish = new Callback(onFinish);

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
			log.warn("Can't sleep the clock - it's sleeping now!");
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