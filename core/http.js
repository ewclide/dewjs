import {Async} from './async';

export class HTTP
{
	constructor()
	{
		this.XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
	}

	get(path, options = {})
	{
		var self = this,
			data = options.data,
			async = new Async(),
			request = new this.XHR();

		options.$join.right({
			uncache : true,
			progress : false
		});

		if (options.uncache)
			!data ? data = { с : Math.random() } : data.с = Math.random();

		request.open("GET", path + this.serialize(data), true);
		request.send();

		request.onload = function()
		{
			async.resolve(this.responseText);
		}
		
		request.onerror = function()
		{
			async.reject(this.statusText);
			log.err("$http.send ajax error (" + this.status + "): " + this.statusText);
		}

		if (options.progress)
			request.onprogress = function(e)
			{
				var response = {
					loaded : e.loaded,
					total  : e.total,
					ready  : e.loaded / e.total
				}
				async.shift(response);
			}

		return async;
	}

	serialize(data)
	{
		var request = "?";

		for (var i in data)
		{
			if (typeof data[i] == "number" || typeof data[i] == "string" || typeof data[i] == "boolean")
				request += i + "=" + data[i] + "&";
		}

		return request.slice(0, -1);
	}

	post(data)
	{
		var self = this,
			formData;

		if (data)
		{
			formData = new FormData();

			for (var key in data)
				formData.append(key, data[key]);
		}
		else log.err("http.post must have some data!");

		return {
			to : function(path, options)
			{
				if (path)
				{
					var async = new Async(),
						request = new self.XHR();
						request.open("POST", path, true);
						request.send(formData);

					request.onload = function()
					{
						async.resolve(this.responseText);
					}

					request.onerror = function()
					{
						async.reject(this.statusText);
						log.err("$http.send ajax error (" + this.status + "): " + this.statusText);
					}

					if (options.progress)
						request.onprogress = function(e)
						{
							var response = {
								loaded : e.loaded,
								total  : e.total,
								ready : e.loaded / e.total
							}
							async.shift(response);
						}

					return async;
				}
				else log.err("http.post must have some path!");
			}
		}
	}
}