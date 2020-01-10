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

    echo(value) {
        const result = value.replace(/^\n?/g, '');
        this[$output].push(result);
        return result;
    }

    join(list, tpl, sp = ', ') {
        const saved = this[$output];
        this[$output] = [];

        list.forEach(item => tpl(item));
        const result = this[$output].join(sp);

        this[$output] = saved;
        return result;
    }

    when(cond, str) {
        return cond ? str : '';
    }
}

module.exports = Scope;