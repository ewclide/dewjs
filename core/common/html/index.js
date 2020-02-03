import log from '../../helper/log';
import { HTMLTools, eventList }  from './html-tools';
import StyleSheet from '../../type/stylesheet';

const proto = HTMLTools.prototype;
const html = new HTMLTools(document);

const $event = {
    fire: (id, type, e) => {
        if (!eventList.has(id)) {
            log.error(`Can't dispatch event on element with id "${id}"`);
            return;
        }

        const events = eventList.get(id);
        if (events.has(type)) {
            events.get(type).call(e);
        }
    }
}

html.extend = function(name, method) {
    proto[name] = method;
    return this;
}

html.script = function(source) {
    return new Promise((resolve, reject) => {

        const element = document.createElement('script');

        element.src = source;
        element.onload = () => resolve(element);
        element.onerror = () => reject(`can't load the script "${source}"`);

        document.body.appendChild(element);
    });
}

html.create = function(tag, attrs, styles) {
    const htls = new HTMLTools(document.createElement(tag));

    if (typeof attrs == 'string') {
        htls.addClass(attrs);
    }

    else if (typeof attrs == 'object') {
        htls.setAttr(attrs);
    }

    if (styles) {
        htls.styles(styles);
    }

    return htls;
}

html.convert = function(elements) {
    if (elements.nodeType === 1 || elements.nodeType === 9) {
        return new HTMLTools(elements);
    }

    else if (typeof elements == 'string') {
        return this.select(elements);
    }

    else if (elements.isHTMLTools) {
        return elements;
    }

    else {
        return false;
    }
}

html.parseXML = function(data) {
    let parse, errors = '';

    if (typeof window.DOMParser != 'undefined') {
        parse = (str) => (new window.DOMParser()).parseFromString(str, 'text/xml');
    }

    else if (typeof window.ActiveXObject != 'undefined' && new window.ActiveXObject('Microsoft.XMLDOM')) {
        parse = (str) => {
            const xml = new window.ActiveXObject('Microsoft.XMLDOM');
            xml.async = 'false';
            xml.loadXML(str);
            return xml;
        }
    }

    else {
        errors = 'parseXML not supported by this browser!';
    }

    return errors ? log.error(errors) : parse(data);
}

html.createStyleSheet = function() {
    return new StyleSheet();
}

html._body = new HTMLTools();

if (!window.$event) {
    const desc = {
        configurable: false,
        enumerable: false,
        writable: false
    }

    Object.defineProperty(window, '$event', { ...desc, value: $event });
}

Object.defineProperty(html, 'body', {
    configurable: false,
    get: function() {
        if (!document.body) {
            log.error('body element is currently unavailable!');
        } else if (!this._body.length) {
            this._body.join(document.body);
        }

        return this._body;
    }
});

Object.defineProperty(html, 'ready', {
    configurable: false,
    get: () => new Promise((resolve) => {
        if (html._ready) {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', resolve);
        }
    })
});

document.addEventListener('DOMContentLoaded', () => html._ready = true );

export default html;