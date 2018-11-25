import { fetchSettings } from "./functions";
import MegaFunction from "./mega-function";

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
    onUpdate : null,
    onStart  : null,
    onFinish : null
}

const _types = {
    timing   : ['string', 'function'],
    duration : 'number'
}

export default class Lerp
{
    constructor(config = {})
    {
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

        this._handlerUpdate = new MegaFunction(onUpdate);
        this._handlerStart  = new MegaFunction(onStart);
        this._handlerFinish = new MegaFunction(onFinish);

        this._stopFlag = false;
        this._finishFlag = false;
        this._startTime = 0;
        this._delta = 1;
        this._stepResolver = () => {}
    }

    onUpdate(fn) {
        this._handlerUpdate.push(fn);
    }

    onStart(fn) {
        this._handlerStart.push(fn);
    }

    onFinish(fn) {
        this._handlerFinish.push(fn);
    }

    setState(from, to)
    {
        if (typeof from == 'number' && typeof to == 'number') {
            this.from = from;
            this.to = to;
            this._delta = to - from;
        }

        return this;
    }

    _update(time)
    {
        let fraction = (time - this._startTime) / this.duration;

        if (fraction < 0) {
            requestAnimationFrame((t) => this._update(t));
            return;
        } else if (fraction > 1) {
            fraction = 1;
            this._stopFlag = true;
        }

        this.progress = this.timing(fraction);
        this.value = this.from + this.progress * this._delta;

        this._handlerUpdate({
            value    : this.value,
            progress : this.progress
        });

        this._stopFlag ? this.stop() : requestAnimationFrame((t) => this._update(t));
    }

    thenState(from, to) {
        return this.setState(from, to).start();
    }

    run() {
        
    }

    pause() {

    }

    start() {
        this.value = this.from;
        this.progress = 0;
        this._stopFlag = false;
        this._startTime = performance.now();
        
        this._handlerStart();
        this._update(this._startTime);

        return new Promise((res) => this._stepResolver = res);
    }

    stop() {
        this.value = this.to;
        this.progress = 1;
        this._stopFlag = true;

        this._handlerFinish();
        this._stepResolver();
    }
}