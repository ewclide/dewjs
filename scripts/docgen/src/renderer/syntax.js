function indexBrackets(str, bracketStore) {
    const brackets = ['()', '{}', '[]'];
    const bracketTypes = [];

    for (const bracket of brackets) {
        const [open, close] = bracket.split('');
        const data = { open, close, depth: 0, count: 0 };

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
        if (type === bracket.open) {
            bracket.depth++;
            bracket.count++;
        }

        return result;
    });
}

function removeBracketIndeces(str, bracketStore) {
    const brackets = new Set([...bracketStore.values()]);
    let result = str;

    for (const bracket of brackets) {
        const { count, open, close } = bracket;
        const regexp = new RegExp(`(\\d+)\\${open}((?:\\n|.)*?)\\1\\${close}`, 'gm');

        for (let i = 0; i < count; i++) {
            result = result.replace(regexp, `${open}$2${close}`);
        }
    }

    return result;
}

function findTemplates(str, tplStore) {
    let tplId = 0;

    const anchor = (tpl, trim) => {
        tplStore.set(tplId, trim ? tpl.trim() : tpl);
        return `<!${tplId++}!>`;
    };

    return str
        // @exp {. }
        .replace(/(\d+)\{(\:|\.)((?:\n|.)*?)\1\}/gm,
            (...a) => ` ${a[1]}{${anchor(a[3], a[2] === '.')}${a[1]}}`)

        // %{ a ?. b : c}
        .replace(/%(\d+)\{(.+?)\?(\:|\.)(.+?):(.+?)\1\}/gm,
            (...a) => {
                const cond = a[2].trim();
                const trim = a[3] === '.';
                return `<~if (${cond}){${anchor(a[4], trim)}}else{${anchor(a[5], trim)}}~>`;
            })
}

function prepareTemplates(str, tplStore) {
    if (!tplStore.size) return str;

    return str.replace(/\<!(\d+)!\>/g, (...a) => {
        const tpl = tplStore.get(+a[1]);
        return `~>${prepareSyntax(tpl, false)}<~`;
    });
}

function prepareOutputs(str) {
    const replacer = (token) => {
        return `<~echo(${token.slice(1)})~>`;
    }

    return str
        .replace(/%(\d+)\{(.*?)\1\}/g, '\${$2}') // %{}
        .replace(/%((?:\w|\.)+)(\d+)\((.*?)\2\)/g, replacer) // %func()
        .replace(/%((?:\w|\.)+)((\d+)\[\d+\2\])+/g, replacer) // %elem[]
        .replace(/%((?:[a-z]|\.)+)([^a-z]|$)/gi, '<~echo($1)~>$2') // %prop.prop
    // return str
    //     .replace(/%(\??)(\d+)\{(.*?)\2\}/g, '\${$2}') // %{}
    //     .replace(/%(\??)((?:\w|\.)+)(\d+)\((.*?)\3\)/g, replacer) // %func()
    //     .replace(/%(\??)((?:\w|\.)+)((\d+)\[\d+\3\])+/g, replacer) // %elem[]
    //     .replace(/%(\??)((?:[a-z]|\.)+)([^a-z]|$)/gi, '<~echo($2)~>$3') // %prop.prop
}

function prepareExpressions(str) {
    return str.replace(/@(.*?)(\d+)\{((?:\n|.)+?)\2\}/gm,
        (...tokens) => {
            let [, expr, br, body] = tokens;
            return `<~echo(() => {${expr}{${body}}})~>`;
        });
}

function prepareSyntax(src, primary = true) {
    const bracketStore = new Map();
    const tplStore = new Map();
    let tpl = src;

    if (primary) {
        tpl = tpl.replace(/`/g, '\\`');
        tpl = indexBrackets(tpl, bracketStore);
    }

    tpl = findTemplates(tpl, tplStore);
    tpl = prepareOutputs(tpl);
    tpl = prepareExpressions(tpl);
    tpl = prepareTemplates(tpl, tplStore);

    if (primary) {
        tpl = removeBracketIndeces(tpl, bracketStore);
    }

    return tpl.replace(/\n/g, '\\n');
}

module.exports = { prepareSyntax };