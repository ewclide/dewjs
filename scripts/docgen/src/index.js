const log = require('node-con-color');
const { getFiles, readFile, createFile, removeSpaces } = require('./utils');
const renderer = require('./renderer');
const parser = require('./parser');
const templates = require('./templates');

class DocumentGenerator {
    constructor(userTemplates = []) {
        this._templates = new Map();
        this._createTemplates(userTemplates);
    }

    _createTemplates(userTemplates) {
        const tpls = [...templates, ...userTemplates];

        for (const { type, name, body, vars } of tpls) {
            const tpl = renderer.create(removeSpaces(body), { vars });
            const key = name + '_' + type;

            this._templates.set(key, tpl);
        }
    }

    translate(src, type = 'md') {
        const data = parser.parse(src);
        console.log(JSON.stringify(data, null, 4))

        let result = [];
        for (const json of data) {
            const key = json.type + '_' + type;

            if (!this._templates.has(key)) continue;

            const tpl = this._templates.get(key);
            result.push(tpl(json));
        }

        return result.join('\n');
    }

    genereate(input, output, type = 'md') {
        const files = getFiles(input, { sync: true, type: 'dg' });

        let src;
        let result;
        let targetName;
        let targetPath;

        log(`#6{Docgen} started at #12{"${input || output}"}`);

        for (const file of files) {
            src = readFile(file.path, { sync: true });
            result = this.translate(src, type);

            targetName = file.name + '.' + type;
            targetPath = `${(input || output)}/${targetName}`;

            createFile(targetPath, result, { resolve: false, cast: false });
            log(`file #12{"${targetName}"} successful created`);
        }

        log('#6{Docgen} completed!\n');
    }
}

module.exports = DocumentGenerator;