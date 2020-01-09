const { bind } = require('./utils');

function prepareValue(value, trim) {
    return trim ? value.trim() : value.replace(/^\n?/g, '');
}

function indexBrackets(str, brackets = ['()', '{}', '[]']) {
    const bracketStore = new Map();
    const bracketTypes = [];

    for (const bracket of brackets) {
        const [open, close] = bracket.split('');
        const data = { open, close, depth: 0 };

        bracketStore.set(open, data);
        bracketStore.set(close, data);
        bracketTypes.push('\\' + open, '\\' + close);
    }

    const regexp = new RegExp(`(${bracketTypes.join('|')})`, 'gm');
    let result = '';

    return str.replace(regexp, (type) => {
        const bracket = bracketStore.get(type);

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

const findTemplates = (() => {
    let id = 0;
    let store = new Map();

    const anchor = (tpl, trim) => {
        store.set(id, trim ? tpl.trim() : tpl);
        return `<!${id++}!>`;
    };

    return (str) => {
        store.clear();

        const result = str
            // %{ a ?. b : c}
            .replace(/%(\d+)\{(.+?)\?(\:|\.)(.+?):(.+?)\1\}/gm,
                (...a) => {
                    const cond = a[2].trim();
                    const trim = a[3] === '.';
                    return `\${${cond}?${anchor(a[4], trim)}:${anchor(a[5], trim)}}`;
                })

            // @exp {. }
            .replace(/(\d+)\{(\:|\.)((?:\n|.)*?)\1\}/gm,
                (...a) => `${a[1]}{${anchor(a[3], a[2] === '.')}${a[1]}}`);

        return { result, store };
    }
})();

function prepareTemplates(store, str) {
    return str.replace(/\<!(\d+)!\>/g, (...a) => {
        const tpl = store.get(id);
        return
    });
}

function prepareOutputs(str) {
    return str
        .replace(/%(\d+)\{(.*?)\1\}/g, '\${$2}') // %{}
        .replace(/%((?:\w|\.)+)(\d+)\((.*?)\2\)/g, (a) => '\${$1($3)}') // %func()
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
    let tpl = input.replace(/`/g, '\\`');

    tpl = indexBrackets(tpl);

    const { store, result } = findTemplates(tpl); console.log(tpl)

    // tpl = prepareTemplates(tpl); console.log(tpl)
    tpl = prepareOutputs(result); console.log(tpl)
    tpl = prepareExpressions(tpl);
    tpl = removeBracketIndeces(tpl);

    return tpl;
}

class SyntaxParser {
    constructor() {
        this._tplId = 0;
        this._tplStore = new Map();
        this._brackets = ['()', '{}', '[]'];
    }

    _indexBrackets(str) {
        const bracketStore = new Map();
        const bracketTypes = [];

        for (const bracket of this._brackets) {
            const [open, close] = bracket.split('');
            const data = { open, close, depth: 0 };

            bracketStore.set(open, data);
            bracketStore.set(close, data);
            bracketTypes.push('\\' + open, '\\' + close);
        }

        const regexp = new RegExp(`(${bracketTypes.join('|')})`, 'gm');
        let result = '';

        return str.replace(regexp, (type) => {
            const bracket = bracketStore.get(type);

            if (type === bracket.close) bracket.depth--;
            result = bracket.depth + type;
            if (type === bracket.open) bracket.depth++;

            return result;
        });
    }

    _removeBracketIndeces(str) {
        let result = str;

        for (const bracket of this._brackets) {
            const [open, close] = bracket.split('');
            const regexp = new RegExp(`(\\d+)\\${open}((?:\\n|.)*?)\\1\\${close}`, 'gm');

            result = result.replace(regexp, `${open}$2${close}`);
        }

        return result;
    }

    _anchor(tpl, trim) {
        this._tplStore.set(this._tplId, trim ? tpl.trim() : tpl);
        return `<!${this._tplId++}!>`;
    };

    _findTemplates(str) {
        this._tplStore.clear();
        this._tplId = 0;

        return str
            // @exp {. }
            .replace(/(\d+)\{(\:|\.)((?:\n|.)*?)\1\}/gm,
                (...a) => `${a[1]}{${this._anchor(a[3], a[2] === '.')}${a[1]}}`)

            // %{ a ?. b : c}
            .replace(/%(\d+)\{(.+?)\?(\:|\.)(.+?):(.+?)\1\}/gm,
                (...a) => {
                    const cond = a[2].trim();
                    const trim = a[3] === '.';
                    return `\${${cond}?${this._anchor(a[4], trim)}:${this._anchor(a[5], trim)}}`;
                })
    }

    _prepareTemplates(str) {
        if (!this._tplStore.size) return str;

        return str.replace(/\<!(\d+)!\>/g, (...a) => {
            const tpl = this._tplStore.get(+a[1]);
            const parser = new SyntaxParser();

            return `echo(\`${parser.prepare(tpl, false)}\`)`;
        });
    }

    _prepareOutputs(str) {
        return str
            .replace(/%(\d+)\{(.*?)\1\}/g, '\${$2}') // %{}
            .replace(/%((?:\w|\.)+)(\d+)\((.*?)\2\)/g, (a) => `\${${a.slice(1)}}`) // %func()
            .replace(/%((?:\w|\.)+)((\d+)\[\d+\2\])+/g, (a) => `\${${a.slice(1)}}`) // %elem[]
            .replace(/%((?:[a-z]|\.)+)([^a-z])/gi, '\${$1}$2') // %prop.prop
    }

    _prepareExpressions(str) {
        return str.replace(/@(.*?)(\d+)\{((?:\n|.)+?)\2\}/gm,
            (...tokens) => {
                const [, expr,, body] = tokens;
                return expr ? `<~${expr}{${body}}~>` : `<~${body}~>`
            });
    }

    prepare(src, primary = true) {
        let tpl = src;

        if (primary) {
            tpl = tpl.replace(/`/g, '\\`');
            tpl = this._indexBrackets(tpl);
        }

        // console.log('prepapre:\n', tpl)
        tpl = this._findTemplates(tpl); //console.log('findTpls:', tpl)
        tpl = this._prepareOutputs(tpl); //console.log('outputs:', tpl)
        tpl = this._prepareExpressions(tpl); //console.log('expr:', tpl)
        tpl = this._prepareTemplates(tpl); console.log('prepTpls:\n', tpl, '\n')

        if (primary) {
           tpl = this._removeBracketIndeces(tpl); //console.log('remove:\n', tpl, '\n')
        }

        return tpl;
    }
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
    const prep = (new SyntaxParser).prepare(str);
    console.log('prepared: ', prep)
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