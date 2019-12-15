const methods = {
    echo(value) {
        return value;
    },
    join(list, sp) {
        return list.join(sp);
    }
}

const template = {
    _wrapMethod(...inputs) {
        const [, method, space] = inputs;
        return `\${this.${method}}${space}`;
    },
    _prepareStrToken(str) {
        return str
            .replace(/%(\w+)(\s)/gm, '\${$1}$2')
            .replace(/@(\w+\([^)]+\))(\s)/gm, this._wrapMethod);
    },
    _prepareToken(str) {
        return str
            .replace(/%(\w+)(\s)/gm, '\${$1}$2')
            .replace(/@(\w+\([^)]+\))(\s)/gm, this._wrapMethod);
    },
    create(str, args) {
        const tokens = str.replace(/\<&/gm, '<&#').split(/\<&|&\>/gm);
        let body = 'let ';

        if (Array.isArray(args)) {
            args.forEach( arg => body += arg + '=data.' + arg + ',' );
        }

        body += `__output__='';`;

        tokens.forEach( token => {
            body += token[0] == '#'
            ? token.slice(1).replace(/:=/g, '__output__+=') + ';\n'
            : '__output__+=`' + this._prepareStrToken(token) + '`;';
        });

        body += ' return __output__';
        console.log(body)

        let render = () => {};
        try {
            const rend = new Function('data', body);
            render = function(tpl) {
                return rend.apply(methods, [tpl]);
            }
        } catch (e) {
            throw new Error(`template error - ${e.message}`);
        }

        return render;
    }
}

const tpl = `
### <&:=name&>

<& :=[1,2,3].join(', ') &>

### %name
@echo('asd')
@join(args, ', ')

<&:=desc&>
`;

const render = template.create(tpl, ['name', 'args', 'desc', 'returns', 'example'])
const result = render({
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