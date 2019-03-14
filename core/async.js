import CallBacker from './callbacker';

export default class Async
{
    constructor() {
        this.__asyncStatus = 0;
        this.__asyncList = [];
        this.__asyncProgress = null;
        this.__asyncRefresh = null;
        this.__asyncReady = 0;
        this.__asyncPermit = true;

        this.__nativePromise = null;
        this.__nativeResolve = null;
        this.__nativeReject = null;

        this.__asyncInit();
    }

    get isAsync() {
		return true;
	}

    get promise() {
        return this.__nativePromise;
    }

    get ready () {
        return this.__asyncReady;
    }

    get pending() {
        return this.__asyncStatus === 0;
    }

    get fulfilled() {
		return this.__asyncStatus === 1;
	}

	get rejected() {
		return this.__asyncStatus === -1;
	}

    __asyncInit() {
        this.__nativeResolve = null;
        this.__nativeReject = null;
        this.__asyncPermit = true;

        this.__nativePromise = new Promise((resolve, reject) => {
            this.__nativeResolve = resolve;
            this.__nativeReject = reject;
        });

        this.__nativePromise
            .then(() => this.__asyncStatus = 1)
            .catch(() => this.__asyncStatus = -1);
    }

    then(handler) {
        return this.__nativePromise.then(handler);
    }

    catch(handler) {
        return this.__nativePromise.catch(handler);
    }

    resolve(e) {
        if (this.__asyncPermit) {
            if (this.__asyncProgress) this.progress(1);
            this.__nativeResolve(e);
        } else {
            console.warn("Can't use resolve after use wait!");
        }
    }

    reject(e) {
        if (this.__asyncPermit) {
            this.__nativeReject(e);
        } else {
            console.warn("Can't use reject after use wait!");
        }
    }

    wait(list, progress) {
        const promises = [];

        this.__asyncList = Array.isArray(list) ? list : [list];
        this.__asyncList.forEach((async) => {
            const prom = async.isAsync ? async.promise : async;
            promises.push(prom);

            if (progress) {
                async.onProgress(() => {
                    this.progress(this.__calcReady());
                });
            }
        });

        this.__asyncPermit = false;

        const wait = Promise.all(promises);
        wait.then((e) => {
            this.__asyncPermit = true;
            this.__nativeResolve(e);
        }).catch((e) => {
            this.__asyncPermit = true;
            this.__nativeReject(e);
        });

        return wait;
    }

    __calcReady() {
        const rate = 1 / this.__asyncList.length;
        let ready = 0;

        this.__asyncList.forEach((async) => ready += async.ready * rate);

		return ready;
	}

    reset() {
        this.__asyncInit();
    }

    refresh(handler) {
		if (!this.__asyncRefresh) {
            this.__asyncRefresh  = new CallBacker();
        }

		this.__asyncRefresh.push(handler);
	}

	again() {
		this.reset();

		if (this.__asyncRefresh) {
            this.__asyncRefresh.call();
        }

		this.__asyncList.forEach((async) => {
			if (async.rejected) async.refresh();
		});
	}

    progress(handler) {
		if (!this.__asyncProgress) {
            this.__asyncProgress = new CallBacker();
        }

		this.__asyncProgress.push(handler);

		return this;
	}

	shift(loaded, total = 1) {
        if (this.__asyncReady == 1) return;

        if (typeof loaded != 'number' && typeof total != 'number') {
            console.warn('Shift method must to receive numeric arguments');
            return;
        }

        const ready = loaded / total;

		if (this.pending && ready >= 0 && ready <= 1) {
            this.__asyncReady = ready;

			if (this.__asyncProgress) {
                this.__asyncProgress.call({ loaded, total });
            }
		}
    }
}