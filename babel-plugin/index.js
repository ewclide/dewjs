module.exports = function({ types: t }) {
    let x = 0;
    return {
        visitor: {
            Identifier(path) {
                console.log(x++)
                if (path.hub.file.code) console.log(path.hub.file.code)
                let name = path.node.name; // reverse the name: JavaScript -> tpircSavaJ
                path.node.name = name.split('').reverse().join('');
            }
        }
    };
}