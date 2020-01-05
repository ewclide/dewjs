const fs = require('fs');
const nodePath = require('path');

function resolvePath(path) {
    return nodePath.resolve(...[].concat(path));
}

const isFile = name => fs.lstatSync(name).isFile();
const isExists = name => fs.existsSync(name);

function normalizeOptions(path_, options_) {
    const path = resolvePath(path_);
    const options = Object.assign({ encoding: 'utf8', sync: false }, options_);

    return { path, options };
}

function prepareFileList(fileList) {
    let path;
    return fileList
        .map(file => {
            path = nodePath.resolve(folder, file);
            return { ...nodePath.parse(path), path };
        })
        .filter(file => isFile(file.path));
}

function getFiles(folder_, options_) {
    const { path: folder, options } = normalizeOptions(folder_, options_);

    if (options.sync) {
        return prepareFileList(fs.readdirSync(folder, options));
    }

    return new Promise((resolve, reject) => {
        fs.readdir(folder, options, (error, items) => {
            if (error) reject(error);
            const files = prepareFileList(items);
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

function createFile(file_, data = '', resolve = true) {
    const file = resolvePath(file_);

    if (!isExists(file)) {
        fs.writeFileSync(file, data);
        return file;
    }

    if (!resolve) {
        throw new Error(`file "${file}" is already exists`);
    }

    return createFile(resolveName(file));
}

function createFolder(folder_, resolve = true) {
    const folder = resolvePath(folder_);

    if (!isExists(folder)) {
        fs.mkdirSync(folder);
        return folder;
    }

    if (!resolve) {
        throw new Error(`folder "${folder}" is already exists`);
    }

    return createFolder(resolveName(folder));
}

module.exports = {
    getFiles,
    readFile,
    writeFile,
    createFile,
    createFolder,
    removeFolder
};
