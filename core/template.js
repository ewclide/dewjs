import { log }  from './functions';

export default class Template
{
    constructor(str, name) {
        this._htl = null;
        this._render = () => {};
        this._create(str, name);
    }

    get isTemplate() {
        return true;
    }

    appendTo(htl) {
        this._htl = $html.convert(htl);
        return this;
    }

    draw(data) {
        try {
            if (this._htl) {
                this._htl.html(this._render(data))

            } else {
                log.error('DEW template must be append to DOM before drawing');
            }
        } catch (e) {
            log.error(`DEW template error - ${e.message}`);
        }
    }

    _create(str, args) {
        const tokens = str.replace(/\<&/g, '<&#').split(/\<&|&\>/gi);
        let func = 'let ';

        if (Array.isArray(args)) {
            args.forEach( arg => func += arg + '=data.' + arg + ',' );
        }

        func += "__output__='';";

        tokens.forEach( token => {
            func += token[0] == "#"
            ? token.slice(1).replace(/:=/g, '__output__+=') + ';\n'
            : "__output__+='" + token.replace(/('|\n)/g, '\\$1') + "';";
        });

        func += ' return __output__';

        try {
            this._render = new Function('data', func);

        } catch (e) {
            log.error(`DEW template error - ${e.message}`);
            this._render = () => {};
        }
    }
}
