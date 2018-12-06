import {printErr} from './functions';
import MegaFunction from './mega-function';

export default class Async
{
    constructor() {
        this.__async__status = 0;
        this.__async__list = [];
        this.__async__permit = true;
        this.__async__progress = null;
        this.__async__refresh = null;
        this.__async__ready = 0;
        this.__async__init();
    }

    get isAsync() {
		return true;
	}

    get asyncNative() {
        return this._promise;
    }

    get asyncReady () {
        return this.__async__ready;
    }
    
    get pending() {
        return this.__async__status === 0;
    }

    get fulfilled() {
		return this.__async__status === 1;
	}

	get rejected() {
		return this.__async__status === -1;
	}

    __async__init() {
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

    then(fn) {
        return this._promise.then(fn);
    }

    catch(fn) {
        return this._promise.catch(fn);
    }

    resolve(e) {
        if (this.__async__permit) this._resolve(e);
        else printErr("can't use resolve after use wait!");
    }

    reject(e) {
        if (this.__async__permit) this._reject(e);
        else printErr("can't use reject after use wait!");
    }

    wait(list, progress) {
        let wait, promises = [];

        this.__async__list = Array.isArray(list) ? list : [list];

        this.__async__list.forEach((async) => {
            let prom = async.isAsync ? async.asyncNative : async;
            promises.push(prom);

            if (progress) {
                async.onAsyncProgress(() => {
                    this.asyncProgress({ ready: this._calcAsyncReady()})
                });
            }     
        });

        this.__async__permit = false;
        
        wait = Promise.all(promises);
        wait.then((e) => {
            this.__async__permit = true;
            this._resolve(e);
        }).catch((e) => {
            this.__async__permit = true;
            this._reject(e);
        });

        return wait;
    }

    _calcAsyncReady() {
        const rate = 1 / this.__async__list.length;
        let ready = 0;

        this.__async__list.forEach((async) => ready += async.asyncReady * rate);
        
		return ready;
	}

    asyncReset() {
        this.__async__init();
    }

    onAsyncRefresh(fn) {
		if (!this.__async__refresh) {
            this.__async__refresh  = new MegaFunction();
        }

		this.__async__refresh.push(fn);
	}

	asyncRefresh() {
		this.asyncReset();

		if (this.__async__refresh) {
            this.__async__refresh();
        }
		
		this.__async__list.forEach((async) => {
			if (async.rejected) async.asyncRefresh();
		});
	}

    onAsyncProgress(fn) {
		if (!this.__async__progress) {
            this.__async__progress = new MegaFunction();
        }

		this.__async__progress.push(fn);

		return this;
	}

	asyncProgress(data) {
        const ready = data.ready;

		if (this.pending && typeof ready == "number" && ready >= 0 && ready <= 1) {
            this.__async__ready = ready;
            
			if (this.__async__progress) {
                this.__async__progress(data);
            }  
		}
    }
}