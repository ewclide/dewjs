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
    return $html;
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
        result.reject("Can't load the script - " + source);
    };

    document.body.appendChild(element);

    return result;
}

$html.create = function(tag, attr, css)
{
    var htls = new HTMLTools(document.createElement(tag));

    if (typeof attr == "string")
        htls.addClass(attr);

    else if (typeof attr == "object")
        htls.setAttr(attr);

    if (css) htls.css(css);

    return htls;
}

$html.convert = function(elements)
{
    if (elements.nodeType == 1 || elements.nodeType == 9)
        return new HTMLTools(elements);

    else if (typeof elements == "string")
        return $html.select(elements);

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

    else errors += 'Error in parseXML: not supported by this browser!';

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