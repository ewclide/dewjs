import {megaFunction} from './functions';
import {bind} from './binder';

export class Timer
{
	constructor(options)
	{
		this._stop = true;

		if (!options) options = {}

		this.count = options.count || 0;
		this.duration = options.duration || 0;
		this.delay = options.delay || 0;
		this.step = options.step || 0;

		this._onTick   = megaFunction(options.onTick);
		this._onStart  = megaFunction(options.onStart);
		this._onStop   = megaFunction(options.onStop);

		this._state = {
			timePassed : 0,
			startTime  : 0,
			iteration  : 0
		}

		this._init();
	}

	get state()
	{
		return this._state;
	}

	_init()
	{
		if (this.step)
		{
			if (!this.count)
				this.count = Math.round(this.duration / this.step);

			this.duration = null;
		}

		if (this.count) this.count--;
	}

	onTick(fn)
	{
		self._onTick.push(fn);
	}

	onStart(fn)
	{
		self._onStart.push(fn);
	}

	onStop(fn)
	{
		self._onStop.push(fn);
	}

	_stepTick(time)
	{
		this._state.timePassed = time - this._state.startTime;

		if (this.count && this._state.iteration++ >= this.count)
			this._stop = true;

		this._onTick(this._state.timePassed);

		this._stop ? this.stop() : setTimeout(() => this._stepTick(performance.now()), this.step);
	}

	_tick(time)
	{
		this._state.timePassed = time - this._state.startTime;

		if (this.count && this._state.iteration++ >= this.count)
			this._stop = true;

		if (this.duration && this._state.timePassed >= this.duration)
			this._stop = true;

		this._onTick(this._state.timePassed);

		this._stop ? this.stop() : requestAnimationFrame(this._tick);
	}

	_infinityTick(time)
	{
		this._state.timePassed = time - this._state.startTime;
		this._onTick(this._state.timePassed);
		this._stop ? this.stop() : requestAnimationFrame(this._tick);
	}

	start()
	{
		this._stop = false;
		
		this.delay
		? setTimeout(() => this._start(), this.delay)
		: this._start();
	}

	_start()
	{
		var tick = this.step ? this._stepTick : this._tick;

		tick = bind.context(tick, this);

		this._state.startTime = performance.now();
		this._state.timePassed = 0;

		if (this._onStart.count) this._onStart();

		tick(state.startTime);
	}

	reset()
	{
		this._state = {
			timePassed : 0,
			startTime : 0,
			iteration : 0
		}
	}

	stop()
	{
		if (this._onStop.count) this._onStop();
		this._stop = true;
	}
}