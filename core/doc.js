import {DocumentTools} from './document-tools';
import {StyleSheet} from './stylesheet';

var proto = DocumentTools.prototype,
    DOC = new DocumentTools(document);

DOC.$define({
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
        var doc = new DocumentTools(document.createElement(tag));

        if (typeof attr == "string")
            doc.addClass(attr);

        else if (typeof attr == "object")
            doc.attr.set(attr);

        if (css) doc.css(css);

        return doc;
    },
    styleSheet()
    {
       return new StyleSheet(); 
    }
});

DOC.ready(function(){
    DOC.body = new DocumentTools(document.body);
});

export {DOC}