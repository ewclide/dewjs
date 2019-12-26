const renderer = require('./renderer');
const templates = require('./templates');
const parser = require('../parser');

class DocumentGenerator {
    _templates = new Map();
    _parser = parser;

    constructor(templates) {
        this._createTemplates(templates);
    }

    _createTemplates(templates) {
        for (const { type, body, vars } of templates) {
            const tpl = renderer.create(body, { vars });
            this._templates.set(type, tpl);
        }
    }

    translate(src) {
        const json = this._parser.parse(src);
        if (!this._templates.has(json.type)) return;

        const tpl = this._templates.has(json.type);
        return tpl.render(json);
    }
}

const docgen = new DocumentGenerator(templates);
module.exports = { docgen };