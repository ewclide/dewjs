const log = require('node-con-color');
const { getFiles, writeFile, dashToCamelCase } = require('./utils');

const prefix = '#6{prebuild:} ';
function gather(folder) {
    log(prefix + `start gather files #12{"${folder}"} at #12{"${folder}/index.js"}`);
    const flist = getFiles(folder, { sync: true });

    let data = '';
    const exceptions = ['rand-i', 'rand-f'];
    for (const { name } of flist) {
        data += `export { ${dashToCamelCase(name, exceptions)} } from '${folder}/${name}';\n`;
    }

    writeFile(`${folder}/index.js`, data);
}

gather('./core/function');
gather('./core/object');
gather('./core/array');
gather('./core/class');
gather('./core/singleton');