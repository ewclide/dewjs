import Timer from "./timer";

const _easing = {
    linear     : (t) => t,
    InQuad     : (t) => t*t,
    OutQuad    : (t) => t*(2-t),
    InOutQuad  : (t) => t<.5 ? 2*t*t : -1+(4-2*t)*t,
    InCubic    : (t) => t*t*t,
    OutCubic   : (t) => (--t)*t*t+1,
    InOutCubic : (t) => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
    InQuart    : (t) => t*t*t*t,
    OutQuart   : (t) => 1-(--t)*t*t*t,
    InOutQuart : (t) => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
    InQuint    : (t) => t*t*t*t*t,
    OutQuint   : (t) => 1+(--t)*t*t*t*t,
    InOutQuint : (t) => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
}

export default class Lerp
{
    constructor(settings = {}) {

        let { timing, duration, action, onStart, onFinish } = settings;

        if (typeof timing == 'string' && timing in _easing) {
            timing = _easing[timing];
        }

        this.timing = timing || _easing.linear;
        this.duration = duration || 500;
        this.from = 0;
        this.to = 1;
        this.value = 0;
        this.progress = 0;

        this._delta = 1;
        this._completed = true;
        this._stateStack = [];

        this._handlerAction = action ? action : () => {};
        this._handlerStart  = onStart  || null;
        this._handlerFinish = onFinish || null;
        this._stepResolver = () => {}

        this._timer = new Timer({
            action: (t) => this._update(t)
        });
    }

    action(handler) {
        this._handlerAction = handler;
    }

    onStart(handler) {
        if (typeof handler == 'function') {
            this._handlerStart = handler;
        } 
    }

    onFinish(handler) {
        if (typeof handler == 'function') {
            this._handlerFinish = handler;
        }
    }

    setState(from, to, duration, timing) {
        if (typeof from != 'number' && typeof to != 'number') {
            console.warn('state object must have required fields [from: numeric, to: numeric]');
            return;
        }

        this.from = from;
        this.to = to;
        this._delta = to - from;
        this.value = from;
        this.progress = 0;
        
        if (typeof duration == 'number') {
            this.duration = duration;
        }

        if (typeof timing == 'string' && timing in _easing) {
            this.timing = _easing[timing];
        } else if (typeof timing == 'function') {
            this.timing = timing;
        }

        return this;
    }

    _update(time) {
        let fraction = time / this.duration;

        if (fraction < 0) {
            return;
        } else if (fraction > 1) {
            fraction = 1;
            this._completed = true;
        }

        this.progress = this.timing(fraction);
        this.value = this.from + this.progress * this._delta;

        this._handlerAction(this.value);

        if (this._completed) {
            this.finish();
        }
    }

    run(from, to, duration, timing) {
        return this.setState(from, to, duration, timing).start();
    }

    sleep(time) {
        return this._timer.sleep(time);
    }

    start() {
        if (this._completed) {
            if (this._handlerStart) this._handlerStart();
            this._completed = false;
        }

        this._timer.start();

        return new Promise((res) => this._stepResolver = res);
    }

    startSync() {
        if (this._completed) {
            if (this._handlerStart) this._handlerStart();
            this._completed = false;
        }

        this._timer.start();
    }

    stop() {
        this._timer.stop();
    }

    finish() {
        this.value = this.to;
        this.progress = 1;

        this._timer.finish();
        
        if (this._handlerFinish) {
            this._handlerFinish();
        }
        
        this._stepResolver();
    }
}