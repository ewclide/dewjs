const _tpl = `
@function>

#name someAction

#description
some desc some desc some desc some desc some desc some desc some desc
some desc some desc some desc some desc some desc some desc some desc some desc some desc
some desc some desc some desc some desc

#arguments
value <String|Number> ! - some desc some desc some desc so
options <Object> ? 2 - some desc some desc some desc so

#return <String>

#example-js
// array of types
const other = 'hello';
if (isType(other, ['string', 'number']) {
    // ...code
}

@function<`;

function getChunks(str) {
    return /@function>([^@]+)@function</gm.exec(str).slice(1);
}

function splitTokens(chunk) {
    const regexp = /#((?:\w|-)+)\b([^#]+)(?:#|$)/g;
    const tokens = [];

    while (token = regexp.exec(chunk)) {
        regexp.lastIndex--;
        const [,name, value] = token;
        tokens.push({ name, value });
    }

    return tokens;
}

function parseValue(value) {
    if (+value) return +value;
    if (value == 'true' || value == 'TRUE') return true;
    if (value == 'false' || value == 'FALSE') return false;

    return true;
}

function getArguments(str) {
    const regParts = {
        name: '^\\s*(\\w+)\\s+',
        type: '<((?:\\w|\\|)+)>\\s*',
        required: '(\\!|\\?)?\\s*',
        defValue: '("[^"]+"|\\d+|true|false|null|Instance)?\\s*',
        description: '-\\s*(.*)$'
    };

    const regexp = new RegExp(Object.values(regParts).join(''), 'g');
    const argsSource = str.trim().split('\n');
    const args = [];

    for (const argStr of argsSource) {
        regexp.lastIndex = 0;
        const parsed = regexp.exec(argStr);
        if (!parsed) continue;

        const [,name, type, required, defValue, description] = parsed;
        args.push({
            required: required === '!',
            type: type.split('|'),
            defValue: parseValue(defValue),
            name,
            description
        });
    }

    return args;
}

function getExample(name, value) {
    const [, type = 'js'] = name.split('-');
    return { type, content: value };
}

function getReturn(str) {
    const [,types] = /<((?:\w|\|)+)>/g.exec(str);
    return types.split('|');
}

function getTokens(chunk) {
    const tokens = splitTokens(chunk);

    for (const token of tokens) {
        let { name, value } = token;

        if (name === 'name') value = value.trim();
        else if (name === 'arguments') value = getArguments(value);
        else if (name === 'return') value = getReturn(value);
        else if (name.search(/^example/) !== -1) {
            name = 'example';
            value = getExample(name, value);
        }

        token.name = name;
        token.value = value;
    }

    return tokens;
}

function gatherTokens(tokens) {
    const json = {};
    for (const { name, value } of tokens) {
        json[name] = value;
    }
    return json;
}

function parse(str) {
    const chunks = getChunks(str);
    const result = [];

    for (const chunk of chunks) {
        const tokens = getTokens(chunk);
        result.push(gatherTokens(tokens));
    }

    return result;
}

const res = parse(_tpl);
console.log(res);