import {HTMLTools}  from './html-tools';
import {StyleSheet} from './stylesheet';
import {Async} from './async';

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
    this.then(fn);
    return $html;
}

$html.script = function(source, add = true)
{
    var script = document.createElement("script"),

    $script = new HTMLTools(script);
    $script.ready = function(fn)
    {
        $script.then(fn);
        return $script;
    }

    script.src = source;
    script.onload = function()
    {
        $script.resolve();
    };

    add
    ? document.body.appendChild(script)
    : $script.event.attach("load", function(){
        $script.resolve();
    })

    return $script;
}

$html.create = function(tag, attr, css)
{
    var htls = new HTMLTools(document.createElement(tag));

    if (typeof attr == "string")
        htls.addClass(attr);

    else if (typeof attr == "object")
        htls.attr.set(attr);

    if (css) htls.css(css);

    return htls;
}

$html.convert = function(elements)
{
    if (elements.nodeType == 1 || elements.nodeType == 9)
        return new HTMLTools(elements);

    else if (elements.isHTMLTools)
        return elements;

    else return false;
}

$html.parseXML = function(data)
{
    var parse, errors = '';

    if (typeof window.DOMParser != "undefined")
        parse = function(str)
        {
            return (new window.DOMParser()).parseFromString(str, "text/xml");
        }

    else if ( typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM") )
        parse = function(str)
        {
            var xml = new window.ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML(str);

            return xml;
        }

    else errors += 'No XML parser found';

    if (!errors) return parse(data);
    else
    {
        log.err(errors);
        return false;
    }
}

$html.cascad = function()
{
    return new StyleSheet(); 
}

document.addEventListener("DOMContentLoaded", function(e){
    $html.body = new HTMLTools(document.body);
    $html.resolve();
    // $html.wait($html._scripts).then($html.resolve);
});

export {$html}