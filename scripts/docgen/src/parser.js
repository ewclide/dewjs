const { logJson } = require('./utils');

function getChunks(str, chunkTypes_ = ['function', 'class']) {
    console.log(str)
    const chunkTypes = [].concat(chunkTypes_);
    const result = [];

    for (const type of chunkTypes) {
        const regExp = new RegExp(`@${type}((?:\\n|.)+?)@end`, 'gm');
        console.log(type, regExp)

        let rawChunk;
        while (rawChunk = regExp.exec(str)) {
            const body = rawChunk[1];
            const chunk = { type, body };

            if (type === 'class') {
                chunk.childs = getChunks(body, 'method');
            }

            result.push(chunk);
        }
    }

    return result;
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
    if (value === 'true' || value === 'TRUE') return true;
    if (value === 'false' || value === 'FALSE') return false;

    return value;
}

function getArguments(str) {
    const regParts = {
        name: '^\\s*(\\w+)\\s+',
        type: '<((?:\\w|\\|)+)>\\s*',
        required: '(\\!|\\?)?\\s*',
        defValue: '("[^"]+"|\\d+|true|false|null|Instance)?\\s*',
        description: '-\\s*((?:\r|.)+?)$'
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
    return { type, content: value.trim() };
}

function getReturns(str) {
    const [,types] = /<((?:\w|\|)+)>/g.exec(str);
    return types.split('|');
}

function getTokens(chunk) {
    const tokens = splitTokens(chunk);

    for (const token of tokens) {
        let { name, value } = token;

        switch (name) {
            case 'async': value = true; break;
            case 'name': value = value.trim(); break;
            case 'description': value = value.trim(); break;
            case 'arguments': value = getArguments(value); break;
            case 'returns': value = getReturns(value); break;
        }

        if (name.search(/^example/) !== -1) {
            name = 'example';
            value = getExample(name, value);
        }

        token.name = name;
        token.value = value;
    }

    return tokens;
}

function gatherTokens(type, tokens) {
    const json = { type };
    for (const { name, value } of tokens) {
        json[name] = value;
    }
    return json;
}

function parse(str) {
    const chunks = getChunks(str);
    console.log(chunks)
    const result = [];

    for (const { type, body } of chunks) {
        const tokens = getTokens(body);
        result.push(gatherTokens(type, tokens));
    }

    return result;
}

module.exports = { parse };