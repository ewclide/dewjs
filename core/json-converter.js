import {HTMLTools} from './html-tools';

export class JsonConverter
{
	constructor()
	{

	}

	toHTML(json)
	{
		if (!json._htool)
        {
            var element, htool, self = this;

            if (!json.tag) json.tag = "div";

            element = document.createElement(json.tag);
            htool = new HTMLTools(element);

            json._defaults = {};

            for (var item in json)
            {
                switch (item)
                {
                    case "text"  : htool.text(json.text); break;
                    case "html"  : htool.inner(json.html); break;
                    case "value" : htool.value(json.value); break;
                    case "checked" : htool.checked(json.checked); break;
                    case "attrs" : htool.attr.set(json.attrs); break;
                    case "css"   : htool.css(json.css); break;
                    case "transform" : htool.transform(json.transform); break;
                    case "nodes" :
                    if (Array.isArray(json.nodes))
                        json.nodes.forEach(function(node){
                            self.toHTML(node)
                        });
                    else self.toHTML(json.nodes);
                    break;
                }
            }

            if (json.content && json.template)
            {
                json._defaults.content = JSON.parse(JSON.stringify(json.content));
                htool.inner(self._getContent(json));
            }

            json._element = element;
            json._htool = htool;

            this._bind(json);

            if (json.events)
                htool.event.attach(json.events);

            json._htool.elements = [];
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

        json._htool.addElements(current);

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
            template = template.replace("{" + token + "}", '<span style="color : red">{unknown token: '+ token +'}</span>');
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
                $bind.change(
                	json.content,
                	field,
                	function(value){
                		json._htool.inner(self._getContent(json));
                	}
                );
        }

        if (json.tag == "input" && json.attrs.type == "text")
            json.value = "";

        if (json.bind)
        {
            for (var i = 0; i < json.bind.length; i++)
            {
                var item = json.bind[i];
                
                switch (item)
                {
                    case "text":
                        $bind.change( json, "text", function(value){
                            json._htool.text(value);
                        });

                        break;
                    case "html":
                        $bind.change( json, "html", function(value){
                            json._htool.inner(value);
                        });

                        break;
                    case "value":
                        $bind.change( json, "value", function(value){
                            json._htool.value(value);
                        });

                        if ((json.tag == "input" && json.attrs.type == "text") || json.tag == "textarea")
                            json._htool.event.attach({
                                input : function(e)
                                {
                                    json._value = e.srcElement.value;
                                    json._htool.value(e.srcElement.value);
                                }
                            });

                        break;
                    case "checked" : 
                        $bind.change( json, "checked", function(value){
                            json._htool.checked(value);
                        });

                        if (json.tag == "input" && (json.attrs.type == "checkbox" || json.attrs.type == "radio"))
                            json._htool.event.attach({
                                change : function(e)
                                {
                                    json._checked = e.srcElement.checked;
                                    json._htool.checked(e.srcElement.checked);
                                }
                            });

                        break;
                    case "attrs":
                        for (let name in json.attrs)
                            $bind.change( json.attrs, name, function(value){
                                var attr = {};
                                attr[name] = value;
                                json._htool.attr.set(attr);
                            });

                        break;
                    case "css":
                        for (let name in json.css)
                            $bind.change( json.css, name, function(value){
                                var style = {};
                                style[name] = value;
                                json._htool.css(style);
                            });

                        break;
                    case "transform":
                        for (let name in json.transform)
                            $bind.change( json.transform, name, function(value){
                                var action = {};
                                action[name] = value;
                                json._htool.transform(action);
                            });

                        break;
                }
            }
        }
	}

	fromHTML(element)
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
                        result.nodes.push(this.fromHTML(elements[i]));

                    else if (elements[i].nodeType == 3)
                        result.text = elements[i].textContent;
                }
            }

            return result;
        }
        else return false;
	}
}