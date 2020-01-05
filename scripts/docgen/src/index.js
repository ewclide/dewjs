const { getFiles, getFileData, createFile } = require('./utils');
const renderer = require('./renderer');
const parser = require('./parser');
const templates = require('./templates');

class DocumentGenerator {
    _templates = new Map();

    constructor(templates) {
        this._createTemplates(templates);
    }

    _createTemplates(templates) {
        for (const { targetType, type, body, vars } of templates) {
            const tpl = renderer.create(body, { vars });
            const key = type + '_' + targetType;

            this._templates.set(key, tpl);
        }
    }

    translate(src, targetType = 'md') {
        const [json] = parser.parse(src);
        const key = json.type + '_' + targetType;

        if (!this._templates.has(key)) return;

        const tpl = this._templates.get(key);

        return tpl.render(json);
    }

    genereate({ input, output, targetType }) {
        const files = getFiles(input, { sync: true });

        let src;
        let result;
        let targetName;
        let targetPath;

        for (const file of files) {
            src = getFileData(file.path, { sync: true });
            result = this.translate(src, targetType);

            targetName = file.name + '.' + targetType;
            targetPath = `${(input || output)}/${targetName}`;

            createFile(targetPath, result);
        }
    }
}

const docgen = new DocumentGenerator(templates);
module.exports = { docgen };