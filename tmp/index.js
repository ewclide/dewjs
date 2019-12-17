function trimStr(str, all) {
	// return str.replace(/^\n|\n$/gm, '');
	return all ? str.replace(/\n\s*/gm, '') : str.trim();
}

function trimLineBreaks(str) {
    return str.replace(/^\n+|\n+$/gm, '');
}

const methods = {
    echo(value) {
        return value;
    },
    join(list, tpl, sp = ', ') {
        console.log(sp)
        return list.map(tpl).join(sp);
    }
}

const template = {
    _prepareSyntax(str) {
        let depth = 0;
        return str
            .replace(/^\n/, '')
            .replace(/(\(|\))/gm, (br) => { // prepare brackets
                if (br === ')') depth--;
                let ibr = depth + br;
                if (br === '(') depth++;
                return ibr;
            })
            .replace(/\n{0,1}@([^\{]*)\{([^\}]+)\}/gm, (...args) => {
                const [, expr, body] = args;
                return expr ? `<~${expr}{~><~${body}~><~}~>` : `<~${body}~>`
            })
            .replace(/%((\w|\.)+)\b/g, '\${$1}')
            .replace(/@((\w|\.)+)(?<nb>\d+)(\()(.*)\k<nb>\)/g, '\${$1($5)}')
            .replace(/\d+(\(|\))/gm, '$1');
    },
    _prepareCodeToken(token) {
        return token[0] === '&' || token[0] === '!'
            ? this._prepareStringToken(token.slice(1), token[0] === '!')
            : trimStr(token);
    },
    _prepareStringToken(token, trim = false) {
        return '__output__+=`' + (trim ? trimStr(token) : token) + '`;';
    },
    create(str, args) {
        const prep = this._prepareSyntax(str);
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
            body += token[0] === '#'
                ? this._prepareCodeToken(token.slice(1))
                : this._prepareStringToken(token)
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
}

let depth = 0;
'asdad ( (()) () ) () asdad'.replace(/(\(|\))/gm, (br) => {
    if (br === ')') depth--;
    let res = depth + br + ' ';
    if (br === '(') depth++;
    return res;
});

'asdad %asd.qwe qweqe'.replace(/%((\w|\.)+)\b/g, '{$1}')
'asdad 1( zxc () 1) qweqe'.match(/(?<nb>\d+)(\()(.*?)\k<nb>\)/g,);


const tpl = `
%name

@if (async) {
    console.log('is async')
}

@if (async) {&
    *async* %name;
    *async* %name;
}

@for (let arg of args) {& ***%arg.name*** : *%arg.type* }

( @join(args, (e) => \`**%e.name** : *%e.type*\`) )
`;

const render = template.create(tpl, ['name', 'args', 'desc', 'returns', 'example', 'async'])
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