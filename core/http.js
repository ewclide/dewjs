import {Async} from './async';
import {printErr} from './functions';
import {objectExtends} from './object';
import {url} from './url';

class HTTP
{
	constructor()
	{
		this.XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
	}

	get(path, options = {})
	{
		var self = this,
			data = options.data,
			result = new Async(),
			request = new this.XHR();

		objectExtends.joinRight(options, {
			uncache  : true,
			progress : false,
			saveData : false,
			errors   : true
		});

		if (options.uncache)
			!data ? data = { с : Math.random() } : data.с = Math.random();

		request.open("GET", path + url.serialize(data), true);
		request.send();

		request.onload = function()
		{
			this.status < 400
			? result.resolve(this.responseText, options.saveData)
			: result.reject(this.status);
		}
		
		request.onerror = function()
		{
			result.reject(this.statusText);

			if (options.errors)
				printErr(`http.send ajax error (${this.status}): ${this.statusText}`);
		}

		if (options.progress)
			request.onprogress = function(e){
				result.shift({
					loaded : e.loaded,
					total  : e.total,
					ready  : e.loaded / e.total
				});
			}

		return result;
	}

	post(data)
	{
		var self = this,
			formData;

		if (data)
		{
			formData = new FormData();
			for (var key in data) formData.append(key, data[key]);
		}
		else printErr("http.post must have some data!");

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
						printErr("$http.send ajax error (" + this.status + "): " + this.statusText);
					}

					if (options.progress)
						request.onprogress = function(e)
						{
							async.shift({
								loaded : e.loaded,
								total  : e.total,
								ready : e.loaded / e.total
							});
						}

					return async;
				}
				else printErr("http.post must have some path!");
			}
		}
	}
}

export var http = new HTTP();

