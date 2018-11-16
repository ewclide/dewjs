import {eventList, HTMLTools} from './html-tools';

export default class JSONConverter
{
	constructor(json)
    {
        this.htl = null;
        this.nodes = {};
        this._struct = {};

        this._createDOM(json, this._struct);
    }

    _createDOM(json, struct)
    {
        if (!json.tag) json.tag = "div";

        let element = document.createElement(json.tag);

        struct.element = element;

        if (!this.htl)
            this.htl = new HTMLTools(element);

        else if (json.key)
        {
            this.nodes[json.key] = new HTMLTools(element);
            struct.key = json.key;
        }

        for (let prop in json)
        {
            switch (prop)
            {
                case "text"    : element.innerText = json.text; break;
                case "html"    : element.innerHTML = json.html; break;
                case "value"   : element.value = json.value; break;
                case "checked" : element.checked = json.checked; break;
                case "type"    : element.type = json.type; break;
                case "name"    : element.name = json.name; break;
                case "attrs"   :
                    for (let i in json.attrs)
                        element.setAttribute(i, json.attrs[i]);
                    break;

                case "styles" :
                    for (let i in json.styles)
                        element.style[i] = json.styles[i];
                    break;

                case "events" :
                    let id = Math.random(),
                        self = this;

                    eventList[id] = {};

                    for (let type in json.events)
                    {
                        eventList[id][type] = function(e){
                            json.events[type](e, self.nodes[json.key], self.htl);
                        }
                        
                        element.setAttribute(`on${type}`, `$html._eventStart(${id},'${type}',event)`);
                    }

                    break;

                case "nodes" :
                    struct.nodes = [];

                    if (!Array.isArray(json.nodes))
                        json.nodes = [json.nodes];

                    for (let i = 0; i < json.nodes.length; i++)
                        this._createDOM(json.nodes[i], struct.nodes[i] = {})

                    break;
            }
        }
    }

    build(struct = this._struct)
    {
        let element = struct.element.cloneNode(true);

        if (struct.nodes)
        {
            let frag = document.createDocumentFragment();

            for (let i = 0; i < struct.nodes.length; i++)
            {
                let structNode = struct.nodes[i],
                    node = this.build(structNode);

                if (structNode.key)
                    this.nodes[structNode.key].join(node);

                frag.appendChild(node);
            }

            element.appendChild(frag);
        }
        
        return element;
    }

    static createJSON()
    {
        if (element.nodeType == 1)
        {
            let result = { tag : element.tagName.toLowerCase() },
            attrs = element.attributes,
            nodes = element.childNodes;

            if (attrs.length)
            {
                result.attrs = {};

                for (let i = 0; i < attrs.length; i++)
                {
                    let attr = attrs[i];

                    if (attr != "tag" && attr != "nodes" && attr != "text")
                        result.attrs[attr.name.replace("-","_")] = attr.value;
                }
            }

            if (nodes.length)
            {
                result.nodes = [];

                for (let i = 0; i < nodes.length; i++)
                {
                    if (nodes[i].nodeType == 1)
                        result.nodes.push(this.createJSON(nodes[i]));

                    else if (nodes[i].nodeType == 3)
                        result.text = nodes[i].textContent;
                }
            }

            return result;
        }
        else return false;
    }
}