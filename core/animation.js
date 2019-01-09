import Lerp from "./lerp";

export default class Animation
{
    constructor() {
        this._lerp = new Lerp();
        this._stack = [];
    }

    setState(state) {
        if (typeof state.from != 'number' && typeof state.to != 'number') {
            console.warn('state object must have required fields [from: numeric, to: numeric]');
            return;
        }

        this._stack.push(state);
    }

    addAction(action) {
        this._lerp.addAction(action);
    }

    clearActions() {
        this._lerp.clearActions();
    }

    clearStates() {
        this._stack = [];
    }

    run() {

    }

    stop() {
        this._lerp.stop();
    }

    finish() {
        this._lerp.finish();
    }
}