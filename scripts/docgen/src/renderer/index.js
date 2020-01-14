const { prepareSyntax } = require('./syntax');
const Scope = require('./scope');

function getPropsList(object) {
    return Object.keys(object).filter(p => p[0] !== '_');
}

function create(str, { vars, debug }) {
    const scope = new Scope();
    const prep = prepareSyntax(str);
    const tokens = prep
        .replace(/\<~/gm, '<~#')
        .split(/\<~|~\>/gm);

    let body = 'const {';
    if (Array.isArray(vars)) {
        body += `${vars}}=data;\n`;
    }

    body += `const {${getPropsList(scope)}}=this;\n`;

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