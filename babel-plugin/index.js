function camelCaseToDash(str, up = false) {
	return str.replace(/[A-Z]/g, s => '-' + s.toLowerCase());
}

function createImportNode(t, name, path) {
    const source = t.stringLiteral(`${path}/${camelCaseToDash(name)}`);
    const specifier = t.importDefaultSpecifier({ type: 'Identifier', name });

    return t.importDeclaration([specifier], source);
}

function prepareImportNode(t, node) {
    const { source, specifiers } = node;
    if (!/dewjs/g.test(source.value)) return node;

    const nodes = [];

    for (const specifier of specifiers) {
        const { name } = specifier.imported;
        const node = createImportNode(t, name, source.value);

        nodes.push(node);
    }

    return nodes;
}

function extractImports(body) {
    let lastImportIndex = 0;
    for (const node of body) {
        if (node.type !== 'ImportDeclaration') break;
        lastImportIndex++;
    }

    return body.splice(0, lastImportIndex);
}

function pushToArray(array, element) {
    if (Array.isArray(element)) {
        array.push(...element);
        return;
    }

    array.push(element);
}

module.exports = function({ types: t }) {
    return {
        visitor: {
            Program(path, opts) {
                const { body } = path.hub.file.ast.program;

                const imports = extractImports(body);
                const newImports = [];

                for (const importNode of imports) {
                    pushToArray(newImports, prepareImportNode(t, importNode))
                }

                body.unshift(...newImports);
            }
        }
    };
}