import {printErr} from './functions';

export default class AsyncExt
{
    constructor()
    {
        this.__async__strict = false;
        this.__async__status = 0;
        this.__async__list = [];
        this.__async__permit = true;
        this.__async__init();
    }

    __async__init()
    {
        this._resolve = null;
        this._reject = null;
        this.__async__permit = true;

        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });

        this._promise
            .then(() => this.__async__status = 1)
            .catch(() => this.__async__status = -1);
    }

    get strict() {
        return this.__async__strict;
    }

    set strict(val)
    {
        if (typeof val == 'boolean')
            this.__async__strict = val;
    }

    get native() {
        return this._promise;
    }

    get status() {
		return this.__async__status;
	}

    get completed() {
		return this.__async__status == 1 ? true : false;
	}

	get failed() {
		return this.__async__status == -1 ? true : false;
	}

	get isAsync() {
		return true;
	}

    then(fn) {
        return this._promise.then(fn);
    }

    catch(fn) {
        return this._promise.catch(fn);
    }

    resolve(e) {
        if (this.__async__permit) this._resolve(e)
        else printErr("can't use resolve after use wait!");
    }

    reject(e) {
        if (this.__async__permit) this._reject(e);
        else printErr("can't use reject after use wait!");
    }

    wait(list)
    {
        let wait, promises = [];

        this.__async__list = Array.isArray(list) ? list : [list];

        this.__async__list.forEach((item) => {
            let prom = item.isAsync ? item.native : item;
            promises.push(prom);
        });

        this.__async__permit = false;
        
        wait = Promise.all(promises);
        wait.then((e) => { this.__async__permit = true; this._resolve(e) })
            .catch((e) => { this.__async__permit = false; this._reject(e) });

        return wait;
    }

    reset() {
        this.__async__init();
    }

    refresh() {

    }
}