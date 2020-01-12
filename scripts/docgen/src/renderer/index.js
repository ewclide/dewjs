const { prepareSyntax } = require('./syntax');
const Scope = require('./scope');

function create(str, { vars, debug = true }) {
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
            ? token.slice(1) + '\n'
            : `echo(\`${token}\`);\n`;
    });

    body += 'return output();';
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