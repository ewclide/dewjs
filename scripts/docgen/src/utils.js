const fs = require('fs');
const nodePath = require('path');

function joinPath(path) {
    return nodePath.resolve(...[].concat(path));
}

const isFile = name => fs.lstatSync(name).isFile();
const isExists = name => fs.existsSync(name);

function normalizeOptions(path_, options_) {
    const path = joinPath(path_);
    const options = Object.assign({ encoding: 'utf8', sync: false }, options_);

    return { path, options };
}

function prepareFileList(folder, fileList, type = []) {
    const types = [].concat(type);
    let path;
    let ext;
    let result;

    result = fileList
        .map(file => {
            path = nodePath.resolve(folder, file);
            ext = nodePath.extname(path).slice(1);
            return { ...nodePath.parse(path), path, ext };
        })
        .filter(file => isFile(file.path));

    return types.length
        ? result.filter(({ ext }) => types.includes(ext))
        : result;
}

function getFiles(folder_, options_) {
    const { path: folder, options } = normalizeOptions(folder_, options_);

    if (options.sync) {
        return prepareFileList(folder, fs.readdirSync(folder, options), options.type);
    }

    return new Promise((resolve, reject) => {
        fs.readdir(folder, options, (error, items) => {
            if (error) reject(error);
            const files = prepareFileList(folder, items, options.type);
            resolve(files);
        });
    });
}

function readFile(path_, options_) {
    const { path, options } = normalizeOptions(path_, options_);

    if (options.sync) {
        return fs.readFileSync(path, options);
    }

    return new Promise((resolve, reject) => {
        fs.readFile(path, options, (error, data) => {
            if (error) reject(error);
            resolve(data);
        });
    });
}

function writeFile(path_, data, options_) {
    const { path, options } = normalizeOptions(path_, options_);

    if (options.sync) {
        return fs.writeFileSync(path, data, options);
    }

    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, options, (error, result) => {
            if (error) reject(error);
            resolve(result);
        });
    });
}

function resolveName(name) {
    const [str, num, ext] = name.replace(/(\(\d+\))|(\..+)?$/, '~$1~$2').split('~');
    if (!num) return str + '(1)' + ext;

    return str + `(${parseInt(num.slice(1)) + 1})` + ext;
}

function resolvePath(path, cast = true) {
    if (!isExists(path)) return path;

    if (cast) {
        throw new Error(`file or folder "${path}" is already exists`);
    }

    return resolvePath(resolveName(path), cast);
}

function createFile(file_, data = '', options = {}) {
    const { resolve = true, cast = true } = options;
    const file = joinPath(file_);
    const path = resolve ? resolvePath(file, cast) : file;

    fs.writeFileSync(path, data);

    return path;
}

function createFolder(folder_, resolve = true) {
    const folder = joinPath(folder_);

    if (!isExists(folder)) {
        fs.mkdirSync(folder);
        return folder;
    }

    if (!resolve) {
        throw new Error(`folder "${folder}" is already exists`);
    }

    return createFolder(resolveName(folder));
}

function bind(context, proto, list) {
    const methods = [...Object.getOwnPropertyNames(proto)]
        .filter(name => {
            if (name === 'constructor' || name[0] === '_') return;
            return list ? list.includes(name) : name;
        });

    for (const name of methods) {
        context[name] = proto[name].bind(context);
    }
}

function removeSpaces(str, depth) {
    return !depth
        ? str.replace(/\n( |\t)+/gm, '\n')
        : str.replace(/\n\t/gm, '\n    ')
             .replace(new RegExp(`\\n( ){1,${depth}}`, 'gm'), '\n');
}

function countNewLines(str, end) {
    const splited = str.split('');
    if (end) splited.reverse();

    let count = 0;
    for (let nl of splited) {
        if (nl !== '\n') return count;
        count++;
    }

    return count;
}

const logJson = (json) => console.log(JSON.stringify(json, null, 4));

module.exports = {
    getFiles,
    readFile,
    writeFile,
    createFile,
    createFolder,
    removeSpaces,
    countNewLines,
    bind,
    logJson
};
