const { getFiles, readFile, createFile } = require('./utils');
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
            const tpl = renderer.create(body, { vars, debug: false });
            const key = name + '_' + type;

            this._templates.set(key, tpl);
        }
    }

    translate(src, type = 'md') {
        const [json] = parser.parse(src);
        // console.log(JSON.stringify(json, null, 4))
        const key = json.type + '_' + type;

        if (!this._templates.has(key)) return;

        const tpl = this._templates.get(key);
        return tpl(json);
    }

    genereate(input, output, type = 'md') {
        const files = getFiles(input, { sync: true, type: 'dg' });

        let src;
        let result;
        let targetName;
        let targetPath;

        for (const file of files) {
            src = readFile(file.path, { sync: true });
            result = this.translate(src, type);

            targetName = file.name + '.' + type;
            targetPath = `${(input || output)}/${targetName}`;

            createFile(targetPath, result, { resolve: false, cast: false });
        }
    }
}

module.exports = DocumentGenerator;