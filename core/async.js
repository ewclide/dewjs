import CallBacker from './callbacker';

export default class Async
{
    constructor() {
        this.__async__status = 0;
        this.__async__list = [];
        this.__async__progress = null;
        this.__async__refresh = null;
        this.__async__ready = 0;

        this.__async__init();
    }

    get isAsync() {
		return true;
	}

    get promise() {
        return this._promise;
    }

    get ready () {
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

    then(handler) {
        return this._promise.then(handler);
    }

    catch(handler) {
        return this._promise.catch(handler);
    }

    resolve(e) {
        if (this.__async__permit) {
            if (this.__async__progress) this.progress(1);
            this._resolve(e);
        } else {
            console.warn("can't use resolve after use wait!");
        }
    }

    reject(e) {
        if (this.__async__permit) {
            this._reject(e);
        } else {
            console.warn("can't use reject after use wait!");
        }
    }

    wait(list, progress) {
        let wait, promises = [];

        this.__async__list = Array.isArray(list) ? list : [list];

        this.__async__list.forEach((async) => {
            let prom = async.isAsync ? async.promise : async;
            promises.push(prom);

            if (progress) {
                async.onProgress(() => {
                    this.progress(this.__calcReady());
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

    __calcReady() {
        const rate = 1 / this.__async__list.length;
        let ready = 0;

        this.__async__list.forEach((async) => ready += async.ready * rate);

		return ready;
	}

    reset() {
        this.__async__init();
    }

    onRefresh(handler) {
		if (!this.__async__refresh) {
            this.__async__refresh  = new CallBacker();
        }

		this.__async__refresh.push(handler);
	}

	refresh() {
		this.reset();

		if (this.__async__refresh) {
            this.__async__refresh.call();
        }

		this.__async__list.forEach((async) => {
			if (async.rejected) async.refresh();
		});
	}

    onProgress(handler) {
		if (!this.__async__progress) {
            this.__async__progress = new CallBacker();
        }

		this.__async__progress.push(handler);

		return this;
	}

	progress(loaded, total = 1) {
        if (this.__async__ready == 1) return;

        if (typeof loaded != "number" && typeof total != "number") {
            console.warn('progress must to receive numeric arguments');
            return;
        }

        const ready = loaded / total;

		if (this.pending && ready >= 0 && ready <= 1) {
            this.__async__ready = ready;

			if (this.__async__progress) {
                this.__async__progress.call({ loaded, total });
            }
		}
    }
}