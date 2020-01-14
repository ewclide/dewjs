const { bind, countNewLines } = require('../utils');

const $saved = Symbol('saved');
const $output = Symbol('output');

function consumeNewLine(value, end) {
    const rate = end ? [0, -1] : [1];
    let result = value;

    if (countNewLines(result, end) > 1) {
        result = result.slice(...rate);
    }

    return result;
}

class Scope {
    constructor() {
        this[$saved] = null;
        this[$output] = [];
        this._consumeNL = false;
        bind(this, Scope.prototype);
    }

    quit() {
        this[$saved] = this[$output];
        this[$output] = [];
    }

    clear(index) {
        if (typeof index === 'number') {
            const { length } = this[$output];
            this[$output].splice(length - 1, 1);
            return '';
        }

        this[$output].length = 0;
        return '';
    }

    output() {
        return (this[$saved] || this[$output]).join('');
    }

    echo(value) {
        if (value === undefined) return '';
        if (typeof value === 'function') {
            this._expr(value);
            return '';
        }

        let result = String(value);
        if (this._consumeNL) result = consumeNewLine(result);

        this._consumeNL = false;
        this[$output].push(result);

        return '';
    }

    join(list, tpl, sp = ', ') {
        let i = 0;
        for (const item of list) {
            tpl(item);
            this.echo(++i < list.length ? sp : '');
        }

        return '';
    }

    when(cond, str) {
        return cond ? str : '';
    }

    _expr(expression) {
        let output = this[$output];
        let lastOutput = output.pop();

        const expOutput = [];
        this[$output] = expOutput;

        expression();

        if (!expOutput.length) {
            this._consumeNL = true;
            lastOutput = consumeNewLine(lastOutput, true);
        }

        this[$output] = output.concat([lastOutput, ...expOutput]);
    }
}

module.exports = Scope;