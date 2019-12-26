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
        .replace(/(?<i>\d+)\(((?:\n|.)*?)\k<i>\)/gm, '($2)')
        .replace(/(?<i>\d+)\[((?:\n|.)*?)\k<i>\]/gm, '[$2]')
        .replace(/(?<i>\d+)\{((?:\n|.)*?)\k<i>\}/gm, '{$2}')
}

function prepareTemplates(str) {
    return str
        .replace(/%(?<i>\d+)\{(.+?)\?(\:|\.)(.+?):(.+?)\k<i>\}/gm,
            (...a) => {
                const trim = a[3] === '.';
                const expr = a[2].trim();
                return `<~if (${expr}) echo(\`${a[4]}\`,${trim}); else echo(\`${a[5]}\`,${trim});~>`;
            })
        .replace(/(?<i>\d+)\{(\:|\.)((?:\n|.)*?)\k<i>\}/gm,
            (...a) => `${a[1]}{echo(\`${a[3]}\`,${a[2] === '.'});${a[1]}}`);
}

function prepareOutputs(str) {
    return str
        .replace(/%((?:\w|\.)+)(?<i>\d+)\((.*?)\k<i>\)/g, '\${$1($3)}')
        .replace(/%(?<i>\d+)\{(.*?)\k<i>\}/g, '\${$2}')
        .replace(/%((?:\w|\.)+)((?<i>\d+)\[\d+\k<i>\])+/g, (a) => `\${${a.slice(1)}}`)
        .replace(/%((?:\w|\.)+)\b/g, '\${$1}')
}

function prepareExpressions(str) {
    return str.replace(/@(.*?)(?<i>\d+)\{((?:\n|.)+?)\k<i>\}/gm,
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
    [$saved] = null;
    [$output] = [];

    quit = () => {
        this[$saved] = this[$output];
        this[$output] = [];
    }

    clear = (index) => {
        if (typeof index === 'number') {
            const { length } = this[$output];
            this[$output].splice(length - 1, 1);
            return '';
        }

        this[$output].length = 0;
        return '';
    }

    output = () => {
        return (this[$saved] || this[$output]).join('');
    }

    echo = (value, trim) => {
        const result = trim ? value.trim() : value.replace(/^\n?/g, '');
        this[$output].push(result);
        return result;
    }

    join = (list, tpl, sp = ', ') => {
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