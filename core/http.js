import {Async} from './async';
import {printErrors} from './functions';
import {object} from './object';

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
			result = new Async(),
			request = new this.XHR();

		object(options).joinRight({
			uncache : true,
			progress : false,
			saveData : false
		});

		if (options.uncache)
			!data ? data = { с : Math.random() } : data.с = Math.random();

		request.open("GET", path + this.serialize(data), true);
		request.send();

		request.onload = function(){
			result.resolve(this.responseText, options.saveData);
		}
		
		request.onerror = function(){
			result.reject(this.statusText);
			printErrors("http.send ajax error (" + this.status + "): " + this.statusText);
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

	serialize(data)
	{
		var request = "?";

		for (var i in data)
			if (typeof data[i] == "number" || typeof data[i] == "string" || typeof data[i] == "boolean")
				request += i + "=" + data[i] + "&";

		return request.slice(0, -1);
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
		else printErrors("http.post must have some data!");

		return {
			to : function(path, options)
			{
				if (path)
				{
					var async = new Async(),
						request = new self.XHR();
						request.open("POST", path, true);
						request.send(formData);

					request.onload = function(){
						async.resolve(this.responseText);
					}

					request.onerror = function(){
						async.reject(this.statusText);
						printErrors("$http.send ajax error (" + this.status + "): " + this.statusText);
					}

					if (options.progress)
						request.onprogress = function(e){
							async.shift({
								loaded : e.loaded,
								total  : e.total,
								ready : e.loaded / e.total
							});
						}

					return async;
				}
				else printErrors("http.post must have some path!");
			}
		}
	}
}