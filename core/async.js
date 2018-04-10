export class Async
{
	constructor()
	{
		this._async_waiters  = [];
		this._async_status   = 0;
		this._async_calls    = superFunction();
		this._async_fails    = superFunction();
		this._async_progress = superFunction();
		this._async_ready    = 0;
		this._async_subReady = false;
		this._async_strict   = true;
		this._async_data     = null;
		this._async_error    = null;
	}

	resolve(data)
	{
		if (this._canStart)
		{
			this._async_status = 1;

			if (this._async_ready != 1)
				this.shift({ ready : 1 });

			if (data) this._async_data = data;
			this._async_calls(data);
		}
	}

	reject(error)
	{
		if (this._canStart)
		{
			this._async_status = -1;
			if (error) this._async_error = error;
			this._async_fails(error);
		}
	}

	get _canStart()
	{
		var waited = true;

		if (this._async_strict && this._async_waiters.length && !this._async_subReady)
			waited = false;

		return this._async_status == 0 && waited ? true : false;
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
		self._async_progress.push(fn);
	}

	shift(data)
	{
		if (typeof data.ready != "number" || data.ready < 0 || data.ready > 1)
			data.ready = 0;

		this._async_ready = data.ready;
		this._async_progress(data);
	}

	wait(list, progress = false)
	{
		var self = this,
			count = 0;

		if (Array.isArray(list))
			list.forEach( item => {
				if (item.isAsync) this._async_waiters.push(item);
			});

		else (list.isAsync)
			this._async_waiters.push(list);

		if (this._async_waiters.length)
			this._async_waiters.forEach( waiter => {

				waiter.then(function(){
					count++;
					if (count == self._async_waiters.length)
						(self._async_subReady = true, self.resolve());
				});

				waiter.except(function(){
					self.reject();
				});

				if (progress)
					waiter.then(function(){
						self.shift({ ready : self._calcProgress() });
					})
			});

		else self.resolve();

		return this;
	}

	_calcProgress()
	{
		var part = 1 / this._async_waiters.length,
			ready = 0;

		this._async_waiters.forEach(function(waiter){
			ready += waiter._async_ready * part;
		});

		return ready;
	}

	set strict(value)
	{
		if (typeof value == "bolean")
			this._async_strict = value;
	}

	get strict()
	{
		return this._async_strict;
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