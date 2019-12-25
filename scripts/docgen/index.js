function trimStr(str, all) {
	// return str.replace(/^\n|\n$/gm, '');
	return all ? str.replace(/\n\s*/gm, '') : str.trim();
}

function trimLineBreaks(str) {
    return str.replace(/^\n+|\n+$/gm, '');
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
    return str.replace(/\d+(\(|\)|\{|\}|\[|\])/gm, '$1')
}

function prepareTemplates(str) {
    return str
        .replace(/%(?<nb>\d+)\{(.+?)\?(\:|\.)(.+?):(.+?)\k<nb>\}/gm,
            (...a) => {
                const trim = a[3] === '.';
                const expr = a[2].trim();
                return `<~if (${expr}) echo(\`${a[4]}\`,${trim}) else echo(\`${a[5]}\`,${trim});~>`;
            })
        .replace(/(?<nb>\d+)\{(\:|\.)((?:\n|.)*?)\k<nb>\}/gm,
            (...a) => `${a[1]}{echo(\`${a[3]}\`,${a[2] === '.'});${a[1]}}`);
}

function prepareOutputs(str) {
    return str
        .replace(/%((?:\w|\.)+)(?<nb>\d+)\((.*?)\k<nb>\)/g, '\${$1($3)}')
        .replace(/%(?<nb>\d+)\{(.*?)\k<nb>\}/g, '\${$2}')
        .replace(/%((?:\w|\.)+)((?<nb>\d+)\[\d+\k<nb>\])+/g, (a) => `\${${a.slice(1)}}`)
        .replace(/%((?:\w|\.)+)\b/g, '\${$1}')
}

function prepareExpressions(str) {
    return str.replace(/\n{0,1}@(.*?)(?<nb>\d+)\{([^\}]+)\k<nb>\}/gm,
        (...a) => {
            const [, expr, br, body] = a;
            return expr ? `<~${expr}{${body}}~>` : `<~${body}~>`
        })
}

function prepareSyntax(input) {
    let tpl = input.replace(/^\n/, '');

    tpl = indexBrackets(tpl); //console.log(tpl)
    tpl = prepareTemplates(tpl); //console.log(tpl)
    tpl = prepareOutputs(tpl); //console.log(tpl)
    tpl = prepareExpressions(tpl); console.log(tpl)
    tpl = removeBracketIndeces(tpl);

    return tpl;
}

const methods = {
    echo(value) {
        return value;
    },
    join(list, tpl, sp = ', ') {
        return list.map(tpl).join(sp);
    }
}

function create(str, args) {
    const prep = prepareSyntax(str);
    const tokens = prep
        .replace(/\<~/gm, '<~#')
        .split(/\<~|~\>/gm);

    let body = 'const {';
    if (Array.isArray(args)) {
        body += `${args.join(', ')}}=data;\n`;
    }

    body += `const {${Object.keys(methods)}}=this;\n`;
    body += `let __output__='';\n`;

    tokens.forEach((token) => {
        if (!token) return;
        body += token[0] == "#" ? token.slice(1) + ';\n' : `echo(\`${token}\`)\n`;
    });

    body += ' return __output__';
    console.log(body)

    let template = () => {};
    try {
        const render = new Function('data', body);
        template = tpl => render.apply(methods, [tpl]);
    } catch (e) {
        throw new Error(`template error - ${e.message}`);
    }

    return template;
}

const tpl = `
%name

%{async ? name : name + 2}

@if (async) {
    console.log('is async')
    {.sync}
}

@if (async) {:
    *async* %name;
    *async* %name;
}

@for (let arg of args) {.
    ***%arg.name*** : *%arg.type*
}

( %join(args, arg => {. **%arg.name** : *%arg.type* }) ) => %{ async ?. Promise(%returns[0]) : %returns[0] }
`;

const render = create(tpl, ['name', 'args', 'desc', 'returns', 'example', 'async'])
const result = render({
    async: true,
    name: 'someFunction',
    args: [
        {  name: 'value', type: 'String' },
        {  name: 'offset', type: 'Number' }
    ],
    desc: `test description`,
    returns: ['String'],
    example: {
        content: `
        const getName = idGetter('unique_');
        getName(); // unique_1
        getName(); // unique_2
        // ...unique_++
        `,
        type: 'js'
    }
});

console.log(tpl, render)
console.log(result)