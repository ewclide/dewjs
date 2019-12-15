import log from '../function/log';
import innerAssign from '../object/inner-assign';
import url from './url';
import Async from '../class/async';

class HTTP {
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

		const { cached, errors, progress } = innerAssign(defaults, settings);

		if (!cached) {
			if (!data) data = {};
			data.c = Math.random();
		}

		request.onload = function() {
			if (this.status < 400) {
				async.resolve(this.responseText)
			} else {
				async.reject(`(${this.status}) ${this.statusText} "${path}"`);
			}
		}

		request.onerror = function() {
			if (errors) {
				log.error(`(${this.status}) ${this.statusText} "${path}"`);
			}
			async.reject(this.statusText);
		}

		if (progress) {
			request.onprogress = function(respose) {
				const { loaded, total } = respose;
				async.shift(loaded, total);
			}
		}

		request.open('GET', path + url.serialize(data), true);
		request.send();

		return async;
	}

	post(data = {}) {
		const formData = new FormData();
		const result = {};

		for (let key in data) {
			formData.append(key, data[key]);
		}

		result.to = (path, settings) => {
			if (!path) {
				log.error('http.post must have some path!');
				return;
			}

			const async = new Async();
			const request = new this._xhr();

			request.onload = function() {
				if (this.status < 400) {
					async.resolve(this.responseText)
				} else {
					async.reject(`(${this.status}) ${this.statusText} "${path}"`);
				}
			}

			request.onerror = function() {
				async.reject(this.statusText);
				log.error(`(${this.status}) ${this.statusText} "${path}"`);
			}

			if (settings.progress) {
				request.onprogress = function(respose) {
					const { loaded, total } = respose;
					async.shift(loaded, total);
				}
			}

			request.open('POST', path, true);
			request.send();

			return async;
		}

		return result;
	}
}

const http = new HTTP();
export default http;
