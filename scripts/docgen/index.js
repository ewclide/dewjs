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
    return str.replace(/\d+(\(|\)|\{|\})/gm, '$1')
}

function prepareTemplates(str) {
    return str.replace(/#'([^']+)'/gm, 'echo(\`$1\`)');
}

function prepareExpressions(str) {
    return str.replace(/\n{0,1}@([^\{]*)\{([^\}]+)\}/gm,
        (...args) => {
            const [, expr, body] = args;
            return expr ? `<~${expr}{${body}}~>` : `<~${body}~>`
        })
}

function prepareOutputs(str) {
    return str.replace(/%((\w|\.)+)\b/g, '\${$1}');
}

function prepareFunctions(str) {
    return str.replace(/@((\w|\.)+)(?<nb>\d+)(\()(.*)\k<nb>\)/g, '<~$1($5)~>');
}

function prepareSyntax(input) {
    let tpl = input.replace(/^\n/, '');

    tpl = prepareTemplates(tpl);
    tpl = indexBrackets(tpl);
    tpl = prepareExpressions(tpl);
    tpl = prepareOutputs(tpl);
    tpl = prepareFunctions(tpl);
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
    console.log(prep)
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
        body += token[0] == "#"
            ? token.slice(1).replace(/:=/g, '__output__+=') + ';\n'
            : `echo(\`${token}\`)`;
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
}

@if (async) {#
    *async* %name;
    *async* %name;
}

@for (let arg of args) {#
    ***%arg.name*** : *%arg.type*
}

( %join(args, arg => #'**%arg.name** : *%arg.type*') ) => %{ async ?$ Promise(%returns[0]) : %returns[0] }
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