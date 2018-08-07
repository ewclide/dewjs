import {MegaFunction} from './mega-function';

export class Async
{
	constructor()
	{
		this._async_waiters  = [];
		this._async_status   = 0;
		this._async_calls    = new MegaFunction();
		this._async_fails    = new MegaFunction();
		this._async_progress = null;
		this._async_refresh  = null;
		this._async_ready    = 0;
		this._async_subReady = false;
		this._async_strict   = true;
		this._async_data     = null;
		this._async_error    = null;
	}

	resolve(data, saveData = false)
	{
		if (this._canStart)
		{
			this._async_status = 1;

			if (this._async_ready != 1) this.shift({ ready : 1 });
			if (saveData) this._async_data = data;
			
			this._async_calls(data);
		}
	}

	reject(error)
	{
		if (this._canStart)
		{
			this._async_status = -1;
			this._async_error = error;
			this._async_fails(error);
		}
	}

	get _canStart()
	{
		var pending = true;

		if (this._async_strict && this._async_waiters.length && !this._async_subReady)
			pending = false;

		return this._async_status == 0 && pending;
	}

	then(fn)
	{
		this._async_calls.push(fn);

		if (this._async_status == 1)
			fn(this._async_data);
	}

	except(fn)
	{
		this._async_fails.push(fn);

		if (this._async_status == -1)
			fn(this._async_error);
	}

	progress(fn)
	{
		if (!this._async_progress)
			this._async_progress = new MegaFunction();

		this._async_progress.push(fn);
	}

	shift(data)
	{
		if (typeof data.ready == "number" || data.ready >= 0 || data.ready <= 1)
		{
			this._async_ready = data.ready;
			this._async_progress(data);
		}
	}

	wait(list, progress = false)
	{
		var self = this, count = 0;

		if (Array.isArray(list))
			list.forEach( item => {
				if (item.isAsync) this._async_waiters.push(item);
			});

		else if (list.isAsync)
			this._async_waiters.push(list);

		if (this._async_waiters.length)
			this._async_waiters.forEach( waiter => {

				waiter.then(function(){
					count++;
					if (count == self._async_waiters.length)
					{
						self._async_subReady = true;
						self.resolve();
					}
				});

				waiter.except(function(){
					self.reject();
				});

				if (progress)
					waiter.progress(function(){
						self.shift({ ready : self._calcProgress() });
					})
			});

		else this.resolve();

		return this;
	}

	_calcProgress()
	{
		var part = 1 / this._async_waiters.length,
			ready = 0;

		this._async_waiters.forEach( waiter => {
			ready += waiter._async_ready * part;
		});

		return ready;
	}

	reset()
	{
		this._async_status   = 0;
		this._async_ready    = 0;
		this._async_subReady = false;
		this._async_data     = null;
		this._async_error    = null;
	}

	onRefresh(fn)
	{
		if (!this._async_refresh)
			this._async_refresh  = new MegaFunction();

		this._async_refresh.push(fn);
	}

	refresh()
	{
		if (this._async_refresh.count)
		{
			this.reset();
			this._async_refresh();
		}
		
		this._async_waiters.forEach( waiter => {
			if (waiter.failed) waiter.refresh()
		});
	}

	set strict(value)
	{
		if (typeof value == "bolean") this._async_strict = value;
	}

	get strict()
	{
		return this._async_strict;
	}

	get status()
	{
		return this._async_status;
	}

	get completed()
	{
		return this._async_status == 1 ? true : false;
	}

	get failed()
	{
		return this._async_status == -1 ? true : false;
	}

	get isAsync()
	{
		return true;
	}
}

Async.wait = function(list, progress)
{
	var async = new Async();
	async.wait(list, progress);
	return async;
}