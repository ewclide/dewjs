const log = require('node-con-color');
const { getFolderContent, writeFile, dashToCamelCase, capitalize } = require('./utils');

function gather(folder, options = {}) {
    log(`gather files #12{"${folder}"} at #12{"${folder}/index.js"}`);

    const { excp = [], caps = false } = options;
    const flist = getFolderContent(folder, { sync: true });
    const exports = [];

    let data = '';
    let exportName;

    for (const { name } of flist) {
        if (name === 'index') continue;

        exportName = dashToCamelCase(name, excp);
        if (caps) exportName = capitalize(exportName);

        data += `import ${exportName} from './${name}';\n`;
        exports.push(exportName);
    }

    data += `\nexport default {\n   ${exports.join(',\n   ')}\n}`;

    writeFile(`${folder}/index.js`, data);
}

log('#6{prebuild gathering} started:\n');

gather('./core/helper', { excp: ['rand-i', 'rand-f'] });
gather('./core/object');
gather('./core/array');
gather('./core/type', { caps: true });
gather('./core/common');

log('\n#6{prebuild gathering} completed!\n');