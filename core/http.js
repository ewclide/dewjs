import {printErr} from './functions';
import {leftJoin} from './object';
import {url} from './url';
import Async from './async';

class HTTP
{
	constructor() {
		this._xhr = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
	}

	get(path, data, settings = {}) {
		const request = new this._xhr();
		const async = new Async();
		const defaults = {
			cached   : false,
			progress : false,
			errors   : false
		}

		settings = leftJoin(defaults, settings);

		if (!settings.cached) {
			if (!data) data = {};
			data.c = Math.random();
		}

		request.onload = function() {
			this.status < 400
			? async.resolve(this.responseText)
			: async.reject(`(${this.status}) ${this.statusText} "${path}"`);
		}
			
		request.onerror = function() {
			if (settings.errors) {
				printErr(`(${this.status}) ${this.statusText} "${path}"`);
			}
			async.reject(this.statusText);
		}

		if (settings.progress)
			request.onprogress = function(respose) {
				const { loaded, total } = respose;
				async.progress(loaded, total); 
			}

		request.open("GET", path + url.serialize(data), true);
		request.send();

		return async;
	}

	post(data = {}) {
		const formData = new FormData();
		const result = {};

		for (let key in data)
			formData.append(key, data[key]);

		result.to = (path, settings) => {
			if (!path) {
				printErr("http.post must have some path!");
				return;
			}

			const async = new Async();
			const request = new this._xhr();

			request.onload = function() {
				this.status < 400
				? async.resolve(this.responseText)
				: async.reject(`(${this.status}) ${this.statusText} "${path}"`);
			}

			request.onerror = function() {
				async.reject(this.statusText);
				printErr(`(${this.status}) ${this.statusText} "${path}"`);
			}

			if (settings.progress)
				request.onprogress = function(respose) {
					const { loaded, total } = respose;
					async.progress(loaded, total);
				}

			request.open("POST", path, true);
			request.send();

			return async;
		}

		return result;
	}
}

export let http = new HTTP();

