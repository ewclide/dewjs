import { HTMLTools, eventList, genElementId } from '../singleton/html/html-tools';
import Callback from './callback';

export default class JSONConverter {
	constructor(json) {
        this.htl = null;
        this.nodes = {};
        this._struct = {};

        this._createDOM(json, this._struct);
    }

    _createDOM(json, struct) {
        if (!json.tag) json.tag = "div";

        const element = document.createElement(json.tag);

        struct.element = element;

        if (!this.htl) {
            this.htl = new HTMLTools(element);

        } else if (json.key) {
            this.nodes[json.key] = new HTMLTools(element);
            struct.key = json.key;
        }

        for (let prop in json) {
            switch (prop) {
                case 'text'    : element.innerText = json.text; break;
                case 'html'    : element.innerHTML = json.html; break;
                case 'value'   : element.value = json.value; break;
                case 'checked' : element.checked = json.checked; break;
                case 'type'    : element.type = json.type; break;
                case 'name'    : element.name = json.name; break;
                case 'attrs'   :
                    for (let i in json.attrs) {
                        element.setAttribute(i, json.attrs[i]);
                    }
                    break;

                case 'styles' :
                    for (let i in json.styles) {
                        element.style[i] = json.styles[i];
                    }
                    break;

                case 'events' :
                    const id = genElementId();
                    const events = new Map();
                    eventList.set(id, events);

                    for (let type in json.events) {
                        const handler = new Callback((e) => {
                            json.events[type](e, this.nodes[json.key], this.htl);
                        });

                        events.set(type, handler);
                        element.setAttribute(`on${type}`, `$event.fire('${id}','${type}',event)`);
                    }

                    break;

                case 'nodes' :
                    struct.nodes = [];

                    if (!Array.isArray(json.nodes)) {
                        json.nodes = [json.nodes];
                    }

                    for (let i = 0; i < json.nodes.length; i++) {
                        this._createDOM(json.nodes[i], struct.nodes[i] = {})
                    }

                    break;
            }
        }
    }

    build(struct = this._struct) {
        const element = struct.element.cloneNode(true);

        if (struct.nodes) {
            const frag = document.createDocumentFragment();

            for (let i = 0; i < struct.nodes.length; i++) {
                const structNode = struct.nodes[i];
                const node = this.build(structNode);

                if (structNode.key) {
                    this.nodes[structNode.key].join(node);
                }

                frag.appendChild(node);
            }

            element.appendChild(frag);
        }

        return element;
    }

    static createJSON() {
        if (element.nodeType !== 1) return false;

        const result = { tag : element.tagName.toLowerCase() };
        const attrs = element.attributes;
        const nodes = element.childNodes;

        if (attrs.length) {
            result.attrs = {};

            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i];

                if (attr !== 'tag' && attr !== 'nodes' && attr !== 'text') {
                    const name = attr.name.replace('-', '_');
                    result.attrs[name] = attr.value;
                }
            }
        }

        if (nodes.length) {
            result.nodes = [];

            for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeType == 1) {
                    result.nodes.push(this.createJSON(nodes[i]));

                } else if (nodes[i].nodeType == 3) {
                    result.text = nodes[i].textContent;
                }
            }
        }

        return result;
    }
}