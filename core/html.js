import {HTMLTools}  from './html-tools';
import {StyleSheet} from './stylesheet';
import {Async} from './async';
import {printErr, define} from './functions';

var proto = HTMLTools.prototype,
    $html = new HTMLTools(document);

$html._eventList = {};

$html._eventFunction = function(id, type, e)
{
    this._eventList[id][type](e);
}

$html.extend = function(name, method)
{
    proto[name] = method;
    return this;
}

$html.ready = function(fn)
{
    if (this._ready) fn()
    else document.addEventListener("DOMContentLoaded", function(){
        fn()
    });
}

$html.script = function(source, add)
{
    var result = new Async(),
        element = document.createElement("script");

    element.src = source;
    element.onload = function(){
        result.resolve(element);
    };
    element.onerror = function(){
        result.reject("can't load the script - " + source);
    };

    document.body.appendChild(element);

    return result;
}

$html.create = function(tag, attrs, styles)
{
    var htls = new HTMLTools(document.createElement(tag));

    if (typeof attrs == "string")
        htls.addClass(attrs);

    else if (typeof attrs == "object")
        htls.setAttr(attrs);

    if (styles) htls.style(styles);

    return htls;
}

$html.convert = function(elements)
{
    if (elements.nodeType == 1 || elements.nodeType == 9)
        return new HTMLTools(elements);

    else if (typeof elements == "string")
        return this.select(elements);

    else if (elements.isHTMLTools)
        return elements;

    else return false;
}

$html.parseXML = function(data)
{
    var parse, errors = '';

    if (typeof window.DOMParser != "undefined")
        parse = function(str){
            return (new window.DOMParser()).parseFromString(str, "text/xml");
        }

    else if ( typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM") )
        parse = function(str){
            var xml = new window.ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML(str);
            return xml;
        }

    else errors = 'parseXML not supported by this browser!';

    return !errors ? parse(data) : printErr(errors);
}

$html.cascad = function()
{
    return new StyleSheet(); 
}

define($html, "body", {
    get : function()
    {
        if (!this._body && document.body)
            this._body = new HTMLTools(document.body);

        else if (!document.body)
            printErr("body element is currently unavailable!");

        return this._body;
    },
    set : function(){}
})

document.addEventListener("DOMContentLoaded", function(){
    $html._ready = true;
});

export {$html}