const { bind } = require('./utils');

function prepareValue(value, trim) {
    return trim ? value.trim() : value.replace(/^\n?/g, '');
}

function indexBrackets(str, brackets = ['()', '{}', '[]']) {
    const bracketData = new Map();
    const regbody = [];

    for (const bracket of brackets) {
        const [open, close] = bracket.split('');
        const data = { open, close, depth: 0 };

        bracketData.set(open, data);
        bracketData.set(close, data);
        regbody.push('\\' + open, '\\' + close);
    }

    const regexp = new RegExp(`(${regbody.join('|')})`, 'gm');
    let result = '';

    return str.replace(regexp, (type) => {
        const bracket = bracketData.get(type);

        if (type === bracket.close) bracket.depth--;
        result = bracket.depth + type;
        if (type === bracket.open) bracket.depth++;

        return result;
    });
}

function removeBracketIndeces(str) {
    return str
        .replace(/(\d+)\(((?:\n|.)*?)\1\)/gm, '($2)')
        .replace(/(\d+)\[((?:\n|.)*?)\1\]/gm, '[$2]')
        .replace(/(\d+)\{((?:\n|.)*?)\1\}/gm, '{$2}')
}

function prepareTemplates(str) {
    return str
        .replace(/(\d+)\{(\:|\.)((?:\n|.)*?)\1\}/gm,
            (...a) => `${a[1]}{echo(\`${a[3]}\`,${a[2] === '.'});${a[1]}}`);
}

function prepareOutputs(str) {
    return str
        .replace(/%(\d+)\{(.+?)\?(\:|\.)(.+?):(.+?)\1\}/gm,
            (...a) => {
                const trim = a[3] === '.';
                const out1 = prepareValue(a[4], trim);
                const out2 = prepareValue(a[5], trim);
                return `\${${a[2].trim()}?\`${out1}\`:\`${out2}\`}`;
            }) // %{ a ?. b : c}
        .replace(/%(\d+)\{(.*?)\1\}/g, '\${$2}') // %{}
        .replace(/%((?:\w|\.)+)(\d+)\((.*?)\2\)/g, '\${$1($3)}') // %func()
        .replace(/%((?:\w|\.)+)((\d+)\[\d+\2\])+/g, (a) => `\${${a.slice(1)}}`) // %elem[]
        .replace(/%((?:[a-z]|\.)+)([^a-z])/gi, '\${$1}$2') // %prop.prop
}

function prepareExpressions(str) {
    return str.replace(/@(.*?)(\d+)\{((?:\n|.)+?)\2\}/gm,
        (...a) => {
            const [, expr, br, body] = a;
            return expr ? `<~${expr}{${body}}~>` : `<~${body}~>`
        })
}

function prepareSyntax(input) {
    let tpl = input;

    tpl = indexBrackets(tpl);
    tpl = prepareTemplates(tpl);
    tpl = prepareOutputs(tpl);
    tpl = prepareExpressions(tpl);
    tpl = removeBracketIndeces(tpl);

    return tpl;
}

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
        const result = trim ? value.trim() : value.replace(/^\n?/g, '');
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

function create(str, { vars, debug }) {
    const scope = new Scope();
    const prep = prepareSyntax(str);
    const tokens = prep
        .replace(/\<~/gm, '<~#')
        .split(/\<~|~\>/gm);

    let body = 'const {';
    if (Array.isArray(vars)) {
        body += `${vars.join(', ')}}=data;\n`;
    }

    body += `const {${Object.keys(scope)}}=this;\n`;

    tokens.forEach((token) => {
        if (!token) return;
        body += token[0] == "#"
            ? token.slice(1) + ';\n'
            : `echo(\`${token.replace(/\n/g, '\\n')}\`)\n`;
    });

    body += ' return output()';
    if (debug) console.log(body);

    let template = () => {};
    try {
        const render = new Function('data', body);
        template = data => render.apply(scope, [data]);
    } catch (e) {
        throw new Error(`template error - ${e.message}:\n\n ${body}\n`);
    }

    return template;
}

module.exports = { create };