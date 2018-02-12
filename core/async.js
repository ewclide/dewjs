export class Async
{
	constructor()
	{
		this.$define({
			_async_waiters : [],
			_async_status  : 0,
			_async_calls   : superFunction(),
			_async_fails   : superFunction(),
			_async_progress: superFunction(),
			_async_data    : null,
			_async_error   : null
		});
	}

	get on()
	{
		var self = this;

		return {
			success : function(fn)
			{
				self._async_calls.push(fn);
				if (self._async_status == 1) fn(self._async_data);
			},
			fail : function(fn)
			{
				self._async_fails.push(fn);
				if (self._async_status == -1) fn(self._async_error);
			},
			progress : function(fn)
			{
				self._async_progress.push(fn);
			}
		}
	}

	get run()
	{
		var self = this;

		return {
			success : function(data)
			{
				if (self._async_status == 0)
				{
					self._async_status = 1;
					if (data) self._async_data = data;
					self._async_calls(data);
				}
			},
			fail : function(error)
			{
				if (self._async_status == 0)
				{
					self._async_status = -1;
					if (error) self._async_error = error;
					self._async_fails(error);
				}
			},
			progress : function(value)
			{
				self._async_progress(value);
			}
		}
	}

	get switch()
	{
		var self = this;

		return {
			success : function()
			{
				self._async_status = 1;
			},
			fail : function()
			{
				self._async_status = -1;
			}
		}
	}

	get completed()
	{
		if (this._async_status == 1) return true;
		else return false;
	}

	get failed()
	{
		if (this._async_status == -1) return true;
		else return false;
	}

	wait(objects)
	{
		var self = this,
			count = 0,
			handler = {};

		if (Array.isArray(objects))
			objects.forEach(function(current){
				self._async_waiters.push(current);
			});

		else this._async_waiters.push(objects);

		this._async_waiters.forEach(function(waiter){
			waiter.on.success(function(){
				count++;
				if (count == self._async_waiters.length)
					self.run.success();
			});
			waiter.on.fail(function(){
				self.run.fail();
			})
		});

		handler.then = function(action)
		{
			if (typeof action == "function")
				self.on.success(action);

			return handler;
		}

		handler.except = function(action)
		{
			if (typeof action == "function")
				self.on.fail(action);

			return handler;
		}

		return handler;
	}
}