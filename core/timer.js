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

		this.onTick   = superFunction(options.onTick);
		this.onStart  = superFunction(options.onStart);
		this.onStop   = superFunction(options.onStop);

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

		this._tick = $bind.context(this._tick, this);
		this._stepTick = $bind.context(this._stepTick, this);
	}

	get on()
	{
		var self = this;
		return {
			tick : function(fn)
			{
				self.onTick.push(fn);
			},
			start : function(fn)
			{
				self.onStart.push(fn);
			},
			stop : function(fn)
			{
				self.onStop.push(fn);
			}
		}
	}

	_common(time)
	{
		this._state.timePassed = time - this._state.startTime;

		if (this.count && this._state.iteration++ >= this.count)
			this._stop = true;
	}

	_stepTick(time)
	{
		var self = this;

		this._common(time);

		this.onTick(this._state.timePassed);

		if (!this._stop)
			setTimeout(function(){
				self._stepTick(performance.now());
			}, this.step);

		else this.stop();
	}

	_tick(time)
	{
		var state = this._state;

		this._common(time);

		if (this.duration && state.timePassed >= this.duration)
			this._stop = true;

		this.onTick(state.timePassed);

		if (!this._stop) requestAnimationFrame(this._tick);
		else this.stop();
	}

	start()
	{
		var self = this;

		this._stop = false;

		if (self.delay)
			setTimeout(function(){
				self._startTimer();
			}, self.delay);

		else self._startTimer();
	}

	_startTimer()
	{
		var tick, state = this._state;

		state.startTime = performance.now();
		state.timePassed = 0;

		if (this.onStart.count) this.onStart();

		if (this.step) tick = this._stepTick;
		else tick = this._tick;

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
		if (this.onStop.count) this.onStop();
		this._stop = true;
	}
}