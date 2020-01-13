const { bind } = require('../utils');

const $saved = Symbol('saved');
const $output = Symbol('output');

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
        if (this._consumeNL && result[0] === '\n') {
            result = result.slice(1);
        }

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
        let lastOutput = output.pop().split('');
        let lastIndex = lastOutput.length - 1;

        const expOutput = [];
        this[$output] = expOutput;

        expression();

        if (!expOutput.length && lastOutput[lastIndex] === '\n') {
            lastOutput.pop();
            this._consumeNL = true;
        }

        output = output.concat([lastOutput.join(''), ...expOutput]);

        this[$output] = output;
    }
}

module.exports = Scope;