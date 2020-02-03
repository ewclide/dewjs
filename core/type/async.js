import log from '../helper/log';
import Callback from './callback';

const createSymbols = (names) => {
    return names.reduce((namespace, name) => {
        namespace[name] = Symbol(name);
        return namespace;
    }, {});
}

const symbol = createSymbols([
    'status',
    'list',
    'progress',
    'refresh',
    'ready',
    'permit',
    'promise',
    'resolve',
    'reject',
    'init',
    'calcReady'
]);

export default class Async {
    [symbol.status] = 0;
    [symbol.list] = [];
    [symbol.progress] = null;
    [symbol.refresh] = null;
    [symbol.ready] = 0;
    [symbol.permit] = true;
    [symbol.promise] = null;
    [symbol.resolve] = null;
    [symbol.reject] = null;

    constructor() {
        this[symbol.init]();
    }

    [symbol.init]() {
        this[symbol.resolve] = null;
        this[symbol.reject] = null;
        this[symbol.permit] = true;

        this[symbol.promise] = new Promise((resolve, reject) => {
            this[symbol.resolve] = resolve;
            this[symbol.reject] = reject;
        });

        this[symbol.promise]
            .then(() => this[symbol.status] = 1)
            .catch(() => this[symbol.status] = -1);
    }

    get isAsync() {
		return true;
	}

    get promise() {
        return this[symbol.promise];
    }

    get ready () {
        return this[symbol.ready];
    }

    get pending() {
        return this[symbol.status] === 0;
    }

    get fulfilled() {
		return this[symbol.status] === 1;
	}

	get rejected() {
		return this[symbol.status] === -1;
	}

    then(handler) {
        return this[symbol.promise].then(handler);
    }

    catch(handler) {
        return this[symbol.promise].catch(handler);
    }

    resolve(e) {
        if (this[symbol.permit]) {
            if (this[symbol.progress]) this.progress(1);
            this[symbol.resolve](e);
        } else {
            log.warn("Can't use resolve after use wait!");
        }
    }

    reject(e) {
        if (this[symbol.permit]) {
            this[symbol.reject](e);
        } else {
            log.warn("Can't use reject after use wait!");
        }
    }

    wait(asyncList, progress) {
        const promises = [];

        this[symbol.list] = Array.isArray(asyncList) ? asyncList : [asyncList];
        this[symbol.list].forEach((async) => {
            const promise = async.isAsync ? async.promise : async;
            promises.push(promise);

            if (progress) {
                async.progress(() => {
                    this.shift(this[symbol.calcReady]());
                });
            }
        });

        this[symbol.permit] = false;

        const wait = Promise.all(promises);
        wait.then((e) => {
            this[symbol.permit] = true;
            this[symbol.resolve](e);
        }).catch((e) => {
            this[symbol.permit] = true;
            this[symbol.reject](e);
        });

        return wait;
    }

    [symbol.calcReady]() {
        const rate = 1 / this[symbol.list].length;
        let ready = 0;

        this[symbol.list].forEach((async) => ready += async.ready * rate);

		return ready;
	}

    reset() {
        this[symbol.init]();
    }

    refresh(handler) {
		if (!this[symbol.refresh]) {
            this[symbol.refresh]  = new Callback();
        }

		this[symbol.refresh].push(handler);
	}

	again() {
		this.reset();

		if (this[symbol.refresh]) {
            this[symbol.refresh].call();
        }

		this[symbol.list].forEach((async) => {
			if (async.rejected) async.refresh();
		});
	}

    progress(handler) {
		if (!this[symbol.progress]) {
            this[symbol.progress] = new Callback();
        }

		this[symbol.progress].push(handler);

		return this;
	}

	shift(loaded, total = 1) {
        if (this[symbol.ready] == 1) return;

        if (typeof loaded != 'number' && typeof total != 'number') {
            log.warn('Shift method must to receive numeric arguments');
            return;
        }

        const ready = loaded / total;

		if (this.pending && ready >= 0 && ready <= 1) {
            this[symbol.ready] = ready;

			if (this[symbol.progress]) {
                this[symbol.progress].call({ loaded, total });
            }
		}
    }
}