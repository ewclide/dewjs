import Callbacker from './callbacker';

export default class ProgressReducer {
    constructor() {
        this._reducers = new Map();
        this._ready = false;
        this._onUpdate = new Callbacker();
        this._onFinish = new Callbacker();
    }

    get ready() {
        return this._ready;
    }

    create(total = 1) {
        const progress = [0, total];
        const reducer = (loaded, uTotal = total) => {
            progress[0] = loaded;
            progress[1] = uTotal;
            this._update();
        };

        this._reducers.set(reducer, progress);

        return reducer;
    }

    delete(reducer) {
        this._reducers.delete(reducer);
    }

    clear() {
        this._reducers.clear();
    }

    reset() {
        this._ready = false;
        this._reducers.clear();
        this._onUpdate.clear();
        this._onFinish.clear();
    }

    onUpdate(handler) {
        this._onUpdate.push(handler)
    }

    onFinish(handler) {
        this._onFinish.push(handler)
    }

    _update() {
        const red = this._reduce();
        const [ loaded, total ] = red;

        if (loaded === total) {
            this._ready = true;
            this._onFinish.call();
        }

        this._onUpdate.call(loaded, total);
    }

    _reduce() {
        const reducers = Array.from(this._reducers.values());
        return reducers.reduce((arr, cur) => {
            arr[0] += cur[0];
            arr[1] += cur[1];
            return arr;
        }, [0, 0]);
    }
}
