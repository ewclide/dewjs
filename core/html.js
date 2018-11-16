import {HTMLTools, eventList}  from './html-tools';
import {printErr, define} from './functions';
import StyleSheet from './stylesheet';
import Async from './async';

let proto = HTMLTools.prototype,
    $html = new HTMLTools(document);

$html._eventStart = function(id, type, e)
{
    eventList[id][type](e);
}

$html.extend = function(name, method)
{
    proto[name] = method;
    return this;
}

$html.ready = function(fn)
{
    if (this._ready) fn()
    else document.addEventListener("DOMContentLoaded", function(){ fn() });
}

$html.script = function(source, add)
{
    let result = new Async(),
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
    let htls = new HTMLTools(document.createElement(tag));

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
    let parse, errors = '';

    if (typeof window.DOMParser != "undefined")
        parse = function(str){
            return (new window.DOMParser()).parseFromString(str, "text/xml");
        }

    else if ( typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM") )
        parse = function(str){
            let xml = new window.ActiveXObject("Microsoft.XMLDOM");
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

$html._body = new HTMLTools();

Object.defineProperty($html, "body", {
    configurable : false,
    get : function()
    {
        if (!this._body.length && document.body)
            this._body.join(document.body);

        else if (!document.body)
            printErr("body element is currently unavailable!");

        return this._body;
    }
});

document.addEventListener("DOMContentLoaded", () => $html._ready = true );

export {$html}