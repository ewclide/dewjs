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

function prepareFileList(folder, list, onlyFiles = false) {
    const result = Array.from(list).map(item => {
            const path = nodePath.resolve(folder, item);
            return { ...nodePath.parse(path), path };
        });

    return onlyFiles ? result.filter(item => isFile(item.path)) : result;
}

function getFolderContent(folder_, options_) {
    const { path: folder, options, onlyFiles } = normalizeOptions(folder_, options_);

    if (options.sync) {
        const files = fs.readdirSync(folder, options);
        return prepareFileList(folder, files, onlyFiles);
    }

    return new Promise((resolve, reject) => {
        fs.readdir(folder, options, (error, files) => {
            if (error) reject(error);
            resolve(prepareFileList(folder, files, onlyFiles));
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

function parseStr(value) {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return isNaN(+value) ? value : +value;
}

function getScriptOptions(argv = process.argv) {
    const [,, ...params] = argv;
    const options = {};
    let i = 0;

    while (i < params.length) {
        const name = params[i];
        let value = params[i + 1];

        if (name[0] === '-') {
            const sub = name.split(/^-|!/g);
            value = sub.length < 3;
            options[sub.reverse()[0]] = value;
            i++;
            continue;
        }

        options[name] = parseStr(value);
        i += 2;
    }

    return options;
}

module.exports = {
    getScriptOptions,
    dashToCamelCase,
    capitalize,
    relative,
    getFolderContent,
    readFile,
    writeFile
};