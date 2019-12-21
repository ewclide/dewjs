const _tpl = `
@function>

#name someAction

#description
some desc some desc some desc some desc some desc some desc some desc
some desc some desc some desc some desc some desc some desc some desc some desc some desc
some desc some desc some desc some desc

#arguments
value <String> ! - some desc some desc some desc so
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

function parse(str) {
    const chunks = getChunks(str);
    const result = [];

    for (const chunk of chunks) {
        result.push(splitTokens(chunk));
    }

    console.log(result)
}

const res = parse(_tpl);
console.log(res);