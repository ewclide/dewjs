import { fetchSettings } from "./functions";
import MegaFunction from "./mega-function";
import { resolve } from "path";

const _easingFunctions = {
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
    timing   : _easingFunctions.linear,
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

        if (typeof timing == 'string' && timing in _easingFunctions)
            timing = _easingFunctions[timing];

        this.timing = timing;
        this.duration = duration;
        this.from = 0;
        this.to = 1;
        this.value = 0;
        this.progress = 0;

        this._onUpdate = new MegaFunction(onUpdate);
        this._onStart  = new MegaFunction(onStart);
        this._onFinish = new MegaFunction(onFinish);

        this._callStack = new MegaFunction();

        this._stopFlag = false;
        this._finishFlag = false;
        this._startTime = 0;
        this._delta = 1;
    }

    onUpdate(fn)
    {
        this._onUpdate.push(fn);
    }

    onStart(fn)
    {
        this._onStart.push(fn);
    }

    onFinish(fn)
    {
        this._onFinish.push(fn);
    }

    setState(from, to)
    {
        if (typeof from == 'number' && typeof to == 'number')
        {
            this.from = from;
            this.to = to;
            this._delta = to - from;
        }

        return this;
    }

    _update(time)
    {
        let fraction = (time - this._startTime) / this.duration;

        if (fraction < 0)
        {
            requestAnimationFrame((t) => this._update(t));
            return;
        }
        else if (fraction > 1)
        {
            fraction = 1;
            this._stopFlag = true;
        }

        this.progress = this.timing(fraction);
        this.value = this.from + this.progress * this._delta;

        this._onUpdate({
            value    : this.value,
            progress : this.progress
        });

        !this._stopFlag ? requestAnimationFrame((t) => this._update(t)) : this.stop();
    }

    thenState___(from, to)
    {
        this._callStack.push(() => {
            this._callStack.shift();
            this.setState(from, to).start();
        });

        return this;
    }

    thenState(from, to)
    {
        return this.setState(from, to).start();
    }

    run()
    {
        
    }

    pause()
    {

    }

    start()
    {
        this.value = this.from;
        this.progress = 0;
        this._stopFlag = false;
        this._startTime = performance.now();
        
        this._onStart();
        this._update(this._startTime);

        return new Promise((res) => this._onFinish.push(res));
    }

    stop()
    {
        this.value = this.to;
        this.progress = 1;
        this._stopFlag = true;

        this._onFinish();
        this._callStack();
    }
}