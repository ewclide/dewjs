const { parse } = require('./src/parser');
const {} = require('./src/index');

async function create({  }) {
    const files = await getFiles(folder);

    let data;
    let tpl;
    let targetName;
    let targetPath;

    for (const file of files) {
        data = await getFileData(file.path);

        tpl = eval(`(() => { return ${data}; })()`);
        targetName = dashToCamelCase(file.name + '.md');
        targetPath = `${(target || folder)}/${targetName}`;

        await createFile(targetPath, render(tpl));
        log(logPrefix + `created file #12{"${targetName}"};`);
    }

    log(logPrefix + `files was successfull created at #12{"${target}"};\n`);
}