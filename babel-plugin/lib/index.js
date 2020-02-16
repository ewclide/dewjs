function camelCaseToDash(str) {
	return str.replace(/[A-Z]/g, s => '-' + s.toLowerCase());
}

const rules = new Map(Object.entries({
    'randi': 'rand-i',
    'randf': 'rand-f'
}));

function createImportNode(t, name, path) {
    const [lib, namespace] = path.split('/');
    const target = rules.has(name) ? rules.get(name) : camelCaseToDash(name);
    const source = t.stringLiteral(`${lib}/core/${namespace}/${target}`);
    const importName = t.identifier(name);
    const specifier = t.importDefaultSpecifier(importName);

    return t.importDeclaration([specifier], source);
}

function createMemberExpression(t, names, index) {
    const idx = index || names.length - 1;
    const property = t.identifier(names[idx]);
    const object = idx > 1
        ? createMemberExpression(t, names, idx - 1)
        : t.identifier(names[idx - 1]);

    return t.memberExpression(object, property);
}

function createVariableNode(t, name, path) {
    const [, namespace] = path.split('/');

    const varName = t.identifier(name);
    const expression = createMemberExpression(t, ['Dew', namespace, name]);
    const variable = t.variableDeclarator(varName, expression);

    return t.variableDeclaration('const', [variable]);
}

const isLibraryNode = (node) => /dewjs/g.test(node.source.value);

function prepareImportNode(t, node, scriptMode) {
    if (!t.isImportDeclaration(node) || !isLibraryNode(node)) return;

    const { source, specifiers } = node;
    const nodes = [];

    for (const specifier of specifiers) {
        if (!t.isImportSpecifier(specifier)) return;

        const { name } = specifier.imported;
        const libNode = scriptMode
            ? createVariableNode(t, name, source.value)
            : createImportNode(t, name, source.value);

        nodes.push(libNode);
    }

    return nodes;
}

module.exports = function({ types: t }) {
    return {
        visitor: {
            ImportDeclaration(path, state) {
                const { scriptMode } = state.opts;
                const importNode = prepareImportNode(t, path.node, scriptMode);

                if (importNode) {
                    path.replaceWithMultiple(importNode);
                }
            }
        }
    };
}