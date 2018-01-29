import {DocumentTools} from './document-tools';

export class JsonConverter
{
	constructor()
	{

	}

	wrap(json)
	{
		if (!json._doc)
        {
            var element, doc, self = this;

            if (!json.tag) json.tag = "div";

            element = document.createElement(json.tag);
            doc = new DocumentTools(element);

            json._defaults = {};

            for (var item in json)
            {
                switch (item)
                {
                    case "text"  : doc.text(json.text); break;
                    case "html"  : doc.html(json.html); break;
                    case "value" : doc.value(json.value); break;
                    case "checked" : doc.checked(json.checked); break;
                    case "attrs" : doc.attr.set(json.attrs); break;
                    case "css"   : doc.css(json.css); break;
                    case "transform" : doc.transform(json.transform, json.transform.units); break;
                    case "nodes" :
                    if (Array.isArray(json.nodes))
                        json.nodes.forEach(function(node){
                            self.wrap(node)
                        });
                    else self.wrap(json.nodes);
                    break;
                }
            }

            if (json.content && json.template)
            {
                json._defaults.content = JSON.parse(JSON.stringify(json.content));
                doc.html(self._getContent(json));
            }

            json._element = element;
            json._doc = doc;

            this._bind(json);

            if (json.events)
                doc.event.attach(json.events);

            json._doc.elements = [];
        }
	}

	build(json)
	{
		var self = this, current = json._element.cloneNode(true);

        if (json.nodes && !json.template)
        {
            if (Array.isArray(json.nodes))
                json.nodes.forEach(function(node){
                    current.appendChild(self.build(node));
                })
            else current.appendChild(self.build(json.nodes));
        }

        json._doc.addElements(current);

        return current;
	}

	_getContent(json)
	{
		var content = json.content,
            template = json.template,
            defaults = json._defaults.content;

        for (var field in content)
        {
            if (content[field] == "")
                content[field] = defaults[field];

            template = template.replace("{" + field + "}", content[field]);
        }

        if (json.nodes)
        {
            if (Array.isArray(json.nodes))
                json.nodes.forEach(function(node, index){
                    template = template.replace("{node[" + index + "]}", node._element.outerHTML);
                });
            else template = template.replace("{node}", json.nodes._element.outerHTML);
        }

        var tokens = this._splitTokens(template);

        tokens.forEach(function(token){
            template = template.replace("{" + token + "}", '<span style="color : red">unknown token: '+ token +'</span>');
        });

        return template;
	}

	_splitTokens(str)
	{
		var token = "", start = false, tokens = [];

        for (var i = 0; i < str.length; i++)
        {
            if (str[i] == "{")
            {
                start = true;
                continue;
            }
            else if (str[i] == "}")
            {
                start = false;
                continue;
            }

            if (start) token += str[i];
            else if (token)
            {
                tokens.push(token);
                token = "";
            }
        }

        return tokens;
	}

	_bind(json)
	{
		var self = this;

        if (json.content && json.template)
        {
            for (let field in json.content)
                bind.change(
                	json.content,
                	field,
                	function(value){
                		json._doc.html(self._getContent(json));
                	}
                );
        }

        if (json.bind)
        {
            for (var item in json.bind)
                switch (item)
                {
                    case "text":
                        if (json.bind.text)
                            bind.change( json, "text", function(value){ json._doc.text(value); });
                        break;
                    case "html":
                        if (json.bind.html)
                            bind.change( json, "html", function(value){ json._doc.html(value); });
                        break;
                    case "value":
                        if (json.bind.value)
                        {
                            bind.change( json, "value", function(value){ json._doc.value(value); });

                            if ((json.tag == "input" && json.attrs.type == "text") || json.tag == "textarea")
                                json._doc.event.attach({
                                    input : function(e)
                                    {
                                        json._value = e.srcElement.value;
                                        json._doc.value(e.srcElement.value);
                                    }
                                });
                        }
                    break;
                    case "checked" : 
                        if (json.bind.checked)
                        {
                            bind.change( json, "checked", function(value){ json._doc.checked(value); });

                            if (json.tag == "input" && (json.attrs.type == "checkbox" || json.attrs.type == "radio"))
                                json._doc.event.attach({
                                    change : function(e)
                                    {
                                        json._checked = e.srcElement.checked;
                                        json._doc.checked(e.srcElement.checked);
                                    }
                                });
                        }
                    break;
                    case "attrs":
                        if (json.bind.attrs)
                            for (let name in json.attrs)
                                bind.change(
                                    json.attrs,
                                    name,
                                    function(value)
                                    {
                                        var attr = {};
                                        attr[name] = value;
                                        json._doc.attr.set(attr);
                                    }
                                );
                        break;
                    case "css":
                        if (json.bind.css)
                            for (let name in json.css)
                                bind.change(
                                    json.css,
                                    name,
                                    function(value)
                                    {
                                        var style = {};
                                        style[name] = value;
                                        json._doc.css(style);
                                    }
                                );
                        break;
                }
        }
	}

	convert(element)
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
                        result.nodes.push(this.convert(elements[i]));

                    else if (elements[i].nodeType == 3)
                        result.text = elements[i].textContent;
                }
            }

            return result;
        }
        else return false;
	}
}