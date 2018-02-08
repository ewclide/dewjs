import {HTMLTools} from './html-tools';
import {StyleSheet} from './stylesheet';

var proto = HTMLTools.prototype,
    $html = new HTMLTools(document);

$html.$define({
    extend : function(name, method)
    {
        proto[name] = method;
    },
    _eventList : {},
    _startEventFunc : function(id, type, e)
    {
        this._eventList[id][type](e);
    },
    parseXML : function(data)
    {
        var parse, errors = '';

        if (typeof window.DOMParser != "undefined")
            parse = function(str)
            {
                return (new window.DOMParser()).parseFromString(str, "text/xml");
            }

        else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM"))
            parse = function(str)
            {
                var xml = new window.ActiveXObject("Microsoft.XMLDOM");
                    xml.async = "false";
                    xml.loadXML(str);

                return xml;
            }

        else errors += 'No XML parser found';

        if (!errors)
            return parse(data);

        else
        {
            log.err(errors);
            return false;
        }
    },
    create(tag, attr, css)
    {
        var htool = new HTMLTools(document.createElement(tag));

        if (typeof attr == "string")
            htool.addClass(attr);

        else if (typeof attr == "object")
            htool.attr.set(attr);

        if (css) htool.css(css);

        return htool;
    },
    styleSheet()
    {
       return new StyleSheet(); 
    }
});

$html.ready(function(){
    $html.body = new HTMLTools(document.body);
});

export {$html}