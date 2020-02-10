const { getFolderContent, readFile, getScriptOptions } = require('./utils');

function prepareNames(namesRaw) {
    const splitRegExp = /\s+as\s+/;
    const names = [];

    namesRaw.split(',').forEach(name => {
        let [original, alias] = name.split(splitRegExp);
        original = original.trim();
        names.push({ original, alias });
    });

    return names;
}

function getImports(input) {
    const importRegexp = /import\s*\{?((?:\w|\s|,)+)\}?\s*from\s*('|")(.+?)\2;?/gm;
    const imports = [];

    const body = input.replace(importRegexp, (...entries) => {
        const [, names,, path] = entries;

        imports.push({ names: prepareNames(names), path });
        return '';
    });

    return {
        imports,
        body
    }
}

function prepareTests(folder, options = {}) {
    // log(`gather files #12{"${folder}"} at #12{"${folder}/index.js"}`);

    const {  } = options;
    const flist = getFolderContent(folder, { sync: true });
    const testList = [];

    for (const { name, path } of flist) {
        if (name === 'index') continue;

        const src = readFile(path, { sync: true });
        const test = getImports(src);

        testList.push(test);
    }

    console.log(testList)
}

const options = getScriptOptions();
prepareTests('./test/unit/common/html', options);