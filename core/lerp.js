import { fetchSettings } from "./functions";
import MegaFunction from "./mega-function";
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

const _defaults = {
    timing   : _easing.linear,
    duration : 500,
    action : null,
    onStart  : null,
    onFinish : null
}

const _types = {
    timing   : ['string', 'function'],
    duration : 'number'
}

export default class Lerp
{
    constructor(config = {}) {

        const settings = fetchSettings(config, _defaults, _types);

        let { timing, duration, onUpdate, onStart, onFinish } = settings;

        if (typeof timing == 'string' && timing in _easing)
            timing = _easing[timing];

        this.timing = timing;
        this.duration = duration;
        this.from = 0;
        this.to = 1;
        this.value = 0;
        this.progress = 0;

        this._delta = 1;
        this._completed = true;

        this._handlerUpdate = new MegaFunction(onUpdate);
        this._handlerStart  = onStart || null;
        this._handlerFinish = onFinish || null;

        this._timer = new Timer({
            action: (t) => this._update(t)
        });

        this._stepResolver = () => {}
    }

    onUpdate(handler) {
        this._handlerUpdate.push(handler);
    }

    clearUpdates() {
        this._handlerUpdate.clear();
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

    setState(from, to, duration = this.duration) {
        if (typeof from == 'number' && typeof to == 'number') {
            this.from = from;
            this.to = to;
            this._delta = to - from;
            this.value = from;
            this.progress = 0;
            this.duration = duration;
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

        this._handlerUpdate(this.value);

        if (this._completed) {
            this.finish();
        }
    }

    thenState(from, to, duration) {
        return this.setState(from, to, duration).start();
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