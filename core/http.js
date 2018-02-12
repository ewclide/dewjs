import {Async} from './async';

export class HTTP
{
	constructor()
	{
		this.XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
	}

	get(path)
	{
		var self = this,
			async = new Async(),
			request = new this.XHR();

		request.open("GET", path + "?c=" + Math.random(), true);
		request.send();
		request.onload = function()
		{
			async.run.success(this.responseText);
		}
		request.onerror = function()
		{
			async.run.fail(this.statusText);
			log.err("$http.send ajax error (" + this.status + "): " + this.statusText);
		}
		request.onprogress = function(e)
		{
			var response = {
				loaded : e.loaded,
				total  : e.total,
				relation : e.loaded / e.total
			}
			async.run.progress(response);
		}

		return async;
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
			to : function(path)
			{
				if (path)
				{
					var async = new Async(),
						request = new self.XHR();
						request.open("POST", path, true);
						request.send(formData);

					request.onload = function()
					{
						async.run.success(this.responseText);
					}
					request.onerror = function()
					{
						async.run.fail(this.statusText);
						log.err("$http.send ajax error (" + this.status + "): " + this.statusText);
					}
					request.onprogress = function(e)
					{
						var response = {
							loaded : e.loaded,
							total  : e.total,
							relation : e.loaded / e.total
						}
						async.run.progress(response);
					}

					return async;
				}
				else log.err("http.post must have some path!");
			}
		}
	}
}