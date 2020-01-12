const { bind } = require('../utils');

const $saved = Symbol('saved');
const $output = Symbol('output');

class Scope {
    constructor() {
        this[$saved] = null;
        this[$output] = [];
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

    echo(value, trim) {
        this[$output].push(trim ? String(value).trim() : String(value));
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

    expr(expression, trim) {
        let output = this[$output];
        const lastSymbol = output[output.length - 1];
        const tmpOutput = [];

        this[$output] = tmpOutput;
        expression();

        if (tmpOutput.length) {
            if (lastSymbol === '\n') output.splice();
            output = output.concat(tmpOutput);
        }

        this[$output] = output;
    }
}

module.exports = Scope;