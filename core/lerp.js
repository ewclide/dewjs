import Timer from "./timer";
import Callbacker from './callbacker';

const EASING = {
    linear     : (t) => t,
    InQuad     : (t) => t*t,
    OutQuad    : (t) => t*(2-t),
    InOutQuad  : (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
    InCubic    : (t) => t*t*t,
    OutCubic   : (t) => (--t)*t*t+1,
    InOutCubic : (t) => t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
    InQuart    : (t) => t*t*t*t,
    OutQuart   : (t) => 1-(--t)*t*t*t,
    InOutQuart : (t) => t < 0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
    InQuint    : (t) => t*t*t*t*t,
    OutQuint   : (t) => 1+(--t)*t*t*t*t,
    InOutQuint : (t) => t < 0.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
}

export default class Lerp
{
    constructor(settings = {}) {
        // common
        let { timing, duration = 500 } = settings;

        if (typeof timing == 'string' && timing in EASING) {
            timing = EASING[timing];
        }

        this._timing = timing || EASING.linear;
        this._duration = duration;
        this._from = 0;
        this._to = 1;
        this._value = 0;
        this._progress = 0;

        // callbacks
        const { action = () => {}, onStart, onFinish } = settings;
        this._action = action;
        this._onStart  = new Callbacker(onStart);
        this._onFinish = new Callbacker(onFinish);

        // spacials
        this._delta = 1;
        this._completed = true;
        this._stepResolver = () => {};
        this._timer = new Timer({
            onUpdate: (dt, elapsed) => this._update(elapsed)
        });
        console.log(this)
    }

    setAction(handler) {
        this._action = handler;
    }

    onStart(handler) {
        this._onStart.push(handler);
    }

    onFinish(handler) {
        this._onFinish.push(handler);
    }

    setState(from, to, duration, timing) {
        if (typeof from != 'number' && typeof to != 'number') {
            console.warn('setState must to recieve required arguments - from, to');
            return;
        }

        this._from = from;
        this._to = to;
        this._delta = to - from;
        this._value = from;
        this._progress = 0;

        if (typeof duration == 'number') {
            this._duration = duration;
        }

        if (typeof timing == 'string' && timing in EASING) {
            this._timing = EASING[timing];
        } else if (typeof timing == 'function') {
            this._timing = timing;
        }

        return this;
    }

    _update(elapsed) {
        const fraction = elapsed / this._duration;

        if (fraction >= 1) {
            this._action(this._to);
            this.finish();
            return;
        }

        this._progress = this._timing(fraction);
        this._value = this._from + this._progress * this._delta;

        this._action(this._value);
    }

    run(from, to, duration, timing) {
        return this.setState(from, to, duration, timing).play();
    }

    sleep(time) {
        return this._timer.sleep(time);
    }

    play() {
        if (this._completed) {
            this._onStart.call();
            this._completed = false;
        }

        this._timer.play();

        return new Promise((res) => this._stepResolver = res);
    }

    pause() {
        this._timer.pause();
    }

    finish() {
        this._value = this._from;
        this._progress = 0;
        this._completed = true;

        this._timer.finish();
        this._onFinish.call();
        this._stepResolver();
    }
}