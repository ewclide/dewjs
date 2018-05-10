import {HTMLTools} from './html-tools';
import {bind} from './binder';

export class JsonConverter
{
	constructor(){}

	toHTML(json)
	{
		if (!json._htl)
        {
            var element, htl;

            if (!json.tag) json.tag = "div";

            element = document.createElement(json.tag);
            htl = new HTMLTools(element);

            json._defaults = {};

            for (var item in json)
            {
                switch (item)
                {
                    case "text"  : htl.text(json.text); break;
                    case "html"  : htl.html(json.html); break;
                    case "value" : htl.value(json.value); break;
                    case "checked" : htl.checked(json.checked); break;
                    case "attrs" : htl.setAttr(json.attrs); break;
                    case "css"   : htl.css(json.css); break;
                    case "transform" : htl.transform(json.transform); break;
                    case "nodes" :
                        if (!Array.isArray(json.nodes)) json.nodes = [json.nodes];
                        json.nodes.forEach( node => this.toHTML(node) )
                        break;
                }
            }

            if (json.content && json.template)
            {
                json._defaults.content = JSON.parse(JSON.stringify(json.content));
                htl.html(this._getTemplate(json));
            }

            json._element = element;
            json._htl = htl;

            this._bind(json);

            if (json.events)
                htl.eventAttach(json.events);

            json._htl.elements = [];
        }
	}

	build(json)
	{
		var current = json._element.cloneNode(true);

        if (json.nodes && !json.template)
        {
            if (Array.isArray(json.nodes))
                json.nodes.forEach( node => current.appendChild(this.build(node)) )

            else current.appendChild(this.build(json.nodes));
        }

        json._htl.addElements(current);

        return current;
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

	_bind(json)
	{
		var self = this;

        if (json.content && json.template)
            for (let field in json.content)
                bind.change(
                	json.content,
                	field,
                	function(value){
                		json._htl.html(self._getTemplate(json));
                	}
                );
    
        if (json.tag == "input" && json.attrs.type == "text")
            json.value = "";

        if (json.bind)
            for (var i = 0; i < json.bind.length; i++)
            {
                var item = json.bind[i];
                
                switch (item)
                {
                    case "text":
                        bind.change( json, "text", function(value){
                            json._htl.text(value);
                        });
                        break;

                    case "html":
                        bind.change( json, "html", function(value){
                            json._htl.html(value);
                        });
                        break;

                    case "value":
                        bind.change( json, "value", function(value){
                            json._htl.value(value);
                        });

                        if ((json.tag == "input" && json.attrs.type == "text") || json.tag == "textarea")
                            json._htl.eventAttach({
                                input : function(e)
                                {
                                    json._value = e.srcElement.value;
                                    json._htl.value(e.srcElement.value);
                                }
                            });
                        break;

                    case "checked" : 
                        bind.change( json, "checked", function(value){
                            json._htl.checked(value);
                        });

                        if (json.tag == "input" && (json.attrs.type == "checkbox" || json.attrs.type == "radio"))
                            json._htl.eventAttach({
                                change : function(e)
                                {
                                    json._checked = e.srcElement.checked;
                                    json._htl.checked(e.srcElement.checked);
                                }
                            });
                        break;

                    case "attrs":
                        for (let name in json.attrs)
                            bind.change( json.attrs, name, function(value){
                                var attr = {};
                                attr[name] = value;
                                json._htl.setAttr(attr);
                            });
                        break;

                    case "css":
                        for (let name in json.css)
                            bind.change( json.css, name, function(value){
                                var style = {};
                                style[name] = value;
                                json._htl.css(style);
                            });
                        break;

                    case "transform":
                        for (let name in json.transform)
                            bind.change( json.transform, name, function(value){
                                var action = {};
                                action[name] = value;
                                json._htl.transform(action);
                            });
                        break;
                }
            }
	}

	getFromHTML(element)
	{
		if (element.nodeType == 1)
        {
            var result, attributes, elements;

            result = {};
            result.tag = element.tagName;
            attributes = element.attributes;
            elements = element.childNodes;

            if (attributes.length)
            {
                result.attrs = {};

                for (var i = 0; i < attributes.length; i++)
                {
                    if (attributes[i] != "tag" && attributes[i] != "nodes" && attributes[i] != "text")
                        result.attrs[attributes[i].name.replace("-","_")] = attributes[i].value;
                }
            }

            if (elements.length)
            {
                result.nodes = [];

                for (var i = 0; i < elements.length; i++)
                {
                    if (elements[i].nodeType == 1)
                        result.nodes.push(this.getFromHTML(elements[i]));

                    else if (elements[i].nodeType == 3)
                        result.text = elements[i].textContent;
                }
            }

            return result;
        }
        else return false;
	}
}