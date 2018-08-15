import {eventList} from './html-tools';
import {bind} from './binder';

export class JsonConverter
{
	constructor(){}

	jsonToDOM(json)
	{
        if (json.element) return json.element;
        if (!json.tag) json.tag = "div";

        var element = document.createElement(json.tag),
            id = Math.random();

        // json._defaults = {};

        for (var prop in json)
        {
            switch (prop)
            {
                case "text"    : element.innerText = json.text; break;
                case "html"    : element.innerHTML = json.html; break;
                case "value"   : element.value = json.value; break;
                case "checked" : element.checked = json.checked; break;
                case "attrs"   :
                    for (let i in json.attrs)
                        element.setAttribute(i, json.attrs[i]);
                    break;
                case "styles" :
                    for (let i in json.styles)
                        element.style[i] = json.styles[i];
                    break;
                case "events" :
                    eventList[id] = {}
                    for (var type in json.events)
                    {
                        eventList[id][type] = json.events[type];
                        element.setAttribute("on" + type, "$html._eventStart(" + id + ",'" + type + "',event)");
                    }
                    break;
                case "nodes" :
                    if (!Array.isArray(json.nodes))
                        json.nodes = [json.nodes];

                    var frag = document.createDocumentFragment();

                    for (var i = 0; i < json.nodes.length; i++)
                        frag.appendChild(this.jsonToDOM(json.nodes[i]));

                    element.appendChild(frag);

                    break;
            }
        }

        // if (json.content && json.template)
        // {
        //     json._defaults.content = JSON.parse(JSON.stringify(json.content));
        //     htl.html(this._getTemplate(json));
        // }

        if (json.nodeName)
            element.setAttribute("node-name", json.nodeName);

        return element;
	}

    jsonFromDOM(element)
    {
        if (element.nodeType == 1)
        {
            var result = { tag : element.tagName.toLowerCase() },
                attrs = element.attributes,
                nodes = element.childNodes;

            if (attrs.length)
            {
                result.attrs = {};

                for (var i = 0; i < attrs.length; i++)
                {
                    let attr = attrs[i];

                    if (attr != "tag" && attr != "nodes" && attr != "text")
                        result.attrs[attr.name.replace("-","_")] = attr.value;
                }
            }

            if (nodes.length)
            {
                result.nodes = [];

                for (var i = 0; i < nodes.length; i++)
                {
                    if (nodes[i].nodeType == 1)
                        result.nodes.push(this.jsonFromDOM(nodes[i]));

                    else if (nodes[i].nodeType == 3)
                        result.text = nodes[i].textContent;
                }
            }

            return result;
        }
        else return false;
    }

    _getTemplate(json)
    {
        var template = json.template,
            defaults = json._defaults.content,
            tokens = this._splitTokens(template);

        for (var field in json.content)
            if (json.content[field] == "")
                json.content[field] = defaults[field];

        tokens.forEach( token => {
            if (token in json.content)
                template = template.replace("{" + token + "}", json.content[token]);
            
            else if (token.search(/node\[\d+\]/g) != -1)
            {
                token = token.replace(/[^0-9]/g, "");
                template = token in json.nodes
                ? template.replace("{node[" + token + "]}", json.nodes[token]._element.outerHTML)
                : template.replace("{node[" + token + "]}", '<span style="color:red">{undefined node index: "'+ token +'"}</span>')
            }
            else template = template.replace("{" + token + "}", '<span style="color:red">{unknown token: "'+ token +'"}</span>')
        });

        return template;
    }

    _splitTokens(str)
    {
        var tokens = [],

        list = str.replace(/\{/g, "{#").split(/\{|\}/gi);
        list.forEach( token => {
            if (token[0] == "#") tokens.push(token.slice(1))
        })

        return tokens;
    }
}

export var jsConv = new JsonConverter();