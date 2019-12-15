const fs = require('fs');
const nodePath = require('path');

function resolvePath(path) {
    return nodePath.resolve(...[].concat(path));
}

function relative(path) {
    return './' + nodePath.relative(process.cwd(), path);
}

const isFile = name => fs.lstatSync(name).isFile();

function normalizeOptions(path_, options_) {
    const path = resolvePath(path_);
    const options = Object.assign({ encoding: 'utf8', sync: false }, options_);

    return { path, options };
}

function prepareFileList(folder, list) {
    return Array.from(list).map(item => {
            const path = nodePath.resolve(folder, item);
            return { ...nodePath.parse(path), path };
        })
        .filter(item => isFile(item.path));
}

function getFiles(folder_, options_) {
    const { path: folder, options } = normalizeOptions(folder_, options_);

    if (options.sync) {
        const files = fs.readdirSync(folder, options);
        return prepareFileList(folder, files);
    }

    return new Promise((resolve, reject) => {
        fs.readdir(folder, options, (error, files) => {
            if (error) reject(error);
            resolve(prepareFileList(folder, files));
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

function dashToCamelCase(str, expt = []) {
    return !expt.includes(str)
        ? str.replace(/-\w/g, s => s.toUpperCase().slice(1))
        : str.replace(/-/g, '')
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = {
    dashToCamelCase,
    capitalize,
    relative,
    getFiles,
    readFile,
    writeFile
};