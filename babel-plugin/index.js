module.exports = function({ types }) {
    return {
        visitor: {
            // Identifier(path) {
            //     console.log(path)
            // },
            Program(path, opts) {
                const { body } = path.hub.file.ast.program;

                for (const node of body) {
                    if (node.type !== 'ImportDeclaration') continue;
                    const { source } = node;

                    source.value = 'asd';
                }
            }
        }
    };
}