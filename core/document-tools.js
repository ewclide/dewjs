import {JsonConverter} from './json-converter';
import {Async} from './async';

var jsonConverter = new JsonConverter(),
    transformUnits = {
        perspective : "px",
        translate : "px",
        rotate : "deg",
        skew : "deg",
        origin : "%",
        transition : "ms"
    },
    actionsList = [ "translate", "rotate", "scale", "skew", "origin", "transition" ]

export class DocumentTools
{
    constructor(elements)
    {
        this.elements = [];
        this.length = 0;
        this._id = random();
        this._query = '';
        this._readyActions = new Async();
        this._transformState = {
            actions : {},
            units : transformUnits
        }

        this.addElements(elements);
    }

    addElements(elements)
    {
        if (!Array.isArray(elements) && elements.length)
        {
            for (var i = 0; i < elements.length; i++)
                this.elements.push(elements[i]);
        }
        else this.elements.$attach(elements);

        this.length = this.elements.length;
    }

    get tag()
    {
        return this.elements[0].tagName.toLowerCase();
    }

    get isDocTool()
    {
        return true;
    }

    ready(fn)
    {
        var self = this;

        this._readyActions.on.success(fn);

        if (this.elements[0] == document)
        {
            document.addEventListener("DOMContentLoaded", function(e){
                self._readyActions.run.success();
            });
        }
        else
        {
            var sub = this.select("img, link, script, frame"),
            async = new Async(),
            waitList = [];

            if (sub.length)
                sub.elements.forEach(function(element){
                    waitList.push(self._wrapAsync(element));
                });
            else
                this.elements.forEach(function(element){
                    waitList.push(self._wrapAsync(element));
                });

            async.wait(waitList).then(function(){
                self._readyActions.run.success();
            });
        }
    }

    _wrapAsync(element)
    {
        var async = new Async(),
        tag = element.tagName.toLowerCase();

        if (tag == "img" && element.complete)
            async.run.success();

        else if (tag == "img" || tag == "link" || tag == "script" || tag == "frame")
            element.addEventListener("load", function(){
                async.run.success();
            });

        else async.run.success();

        return async;
    }

    select(query)
    {
        var elements = [], result;

        this.elements.forEach(function(element){
            var search = element.querySelectorAll(query);
            elements.$attach(Array.from(search));
        });

        result = new DocumentTools(elements);
        result._query = query;

        return result;
    }

    _getInsertMethod(name)
    {
        var methods = {
            before : function(element, current)
            {
                if (current.parentNode)
                    current.parentNode.insertBefore(element, current);
            },
            after : function(element, current)
            {
                if (current.parentNode)
                    current.parentNode.insertBefore(element, current.nextSibling);
            },
            append : function(element, current)
            {
                current.appendChild(element, current);
            },
            prepend : function(element, current)
            {
                current.insertBefore(element, current.childNodes[0]);
            }
        }

        return methods[name];
    }

    before(doc, del = true)
    {
        return this._insert(doc, del, this._getInsertMethod("before"));
    }

    after(doc, del = true)
    {
        return this._insert(doc, del, this._getInsertMethod("after"));
    }

    append(doc, del = true)
    {
        return this._insert(doc, del, this._getInsertMethod("append"));
    }    

    prepend(doc, del = true)
    {
        return this._insert(doc, del, this._getInsertMethod("prepend"));
    }

    _insert(doc, del, method)
    {
        var self = this, result = [];

        doc = this.convert(doc);

        if (doc)
        {
            this.elements.forEach(function(element){

                var clones = [];

                doc.elements.forEach(function(insertElement){
                    var clone = insertElement.cloneNode(true);
                    clones.push(clone);
                    method(clone, element);
                });

                result = result.concat(clones);
            });

            if (del) doc.remove();

            doc.addElements(result);

            return doc;
        }
        else return false;
    }

    addClass(name)
    {
        this.elements.forEach(function(element){
            var attr = element.getAttribute("class");
            if (attr) attr += " " + name;
            else attr = name;
            element.setAttribute("class", attr);
        });
    }

    removeClass(name)
    {
        this.elements.forEach(function(element){
            var attr = element.getAttribute("class");
            attr = attr.split(" ");
            attr = attr.filter(function(value){
                return value != name;
            });
            attr = attr.join(" ");
            element.setAttribute(attr);
        });
    }

    html(str, clear = true)
    {
        if (str !== undefined)
        {
            this.elements.forEach(function(element){
                if (clear) element.innerHTML = str;
                else element.innerHTML += str;
            });

            return this;
        }
        else return this.elements[0].innerHTML;
    }

    text(str)
    {
        if (str !== undefined)
        {
            this.elements.forEach(function(element){
                element.innerText = str;
            });

            return this;
        }
        else return this.elements[0].innerText;
    }

    value(data)
    {
        if (data !== undefined)
        {
            this.elements.forEach(function(element){
                element.value = data;
            });

            return this;
        }
        else return this.elements[0].value;
    }

    active(flag)
    {
        if (flag) this.addClass("active");
        else this.removeClass("active");
    }

    checked(flag)
    {
        if (typeof flag == "boolean")
            this.elements.forEach(function(element){
                if ("checked" in element)
                    element.checked = flag;
            });
        else if (flag == undefined)
            return this.elements[0].checked;
    }

    toogle()
    {
        this.elements.forEach(function(element){
            if ("checked" in element)
            {
                if (element.checked) element.checked = false;
                else element.checked = true;
            }
        });
    }

    get index()
    {
        return this.elements[0].selectedIndex;
    }

    choose(index)
    {
        this.elements.forEach(function(element){
            if ("selectedIndex" in element)
                element.selectedIndex = index;
        });
    }

    width(value)
    {
        if (value)
        {
            if (typeof value == "number") value += "px";
            this.elements.forEach(function(element){
                element.style.width = value;
            });
        }
        else return this.elements[0].offsetWidth;
    }

    height(value)
    {
        if (value)
        {
            if (typeof value == "number") value += "px";
            this.elements.forEach(function(element){
                element.style.height = value;
            });
        } 
        else return this.elements[0].offsetHeight;
    }

    wrap(classList)
    {
        if (typeof classList == "string")
        {
            var wrapper = DOC.create("div", classList);
            this.after(wrapper);
            wrapper.append(this);
            return wrapper;
        }
        else if (Array.isArray(classList))
        {
            var wrapper = DOC.create("div", classList[0]), inside = "";

            for (var i = 1; i < classList.length; i++)
                inside += '<div class="' + classList[i] + '">';

            for (var i = 1; i < classList.length; i++)
                inside += '</div>';

            wrapper.html(inside);
            this.after(wrapper);
            wrapper.select("." + classList[classList.length - 1]).append(this);

            return wrapper;
        }
    }

    hide()
    {
        this.css({ display : "none" });
        return this;
    }

    show()
    {
        this.css({ display : "block" });
        return this;
    }

    get transform()
    {
        var self = this;

        return {
            apply : function(actions)
            {
                var selfActions = self._transformState.actions,
                    units = self._transformState.units;

                for (var i in actions)
                {
                    if (actionsList.$have(i))
                        self._transformState.actions[i] = actions[i];
                }

                if (selfActions.transition)
                    self.css({ "transition" : selfActions.transition + units.transition });

                if (selfActions.origin && selfActions.origin.length == 2)
                    self.css({ "transform-origin" : selfActions.origin[0] + units.origin + " " + selfActions.origin[1] + units.origin });

                self.css({ "transform" : self._buildTransform(selfActions, units) });

                return self;
            },
            units : function(units)
            {
                var state = self._transformState;

                if (typeof units == "object")
                    for (var i in units)
                    {
                        if (i in state.units)
                            state.units[i] = units[i];
                    }
            },
            reset : function(units)
            {
                self._transformState.actions = {};
                if (units) self._transformState.units = transformUnits;
            }
        }
    }

    _buildTransform(actions, units)
    {
        var result = "";

        for (var name in actions)
        {
            var action = actions[name],
                unit = units[name] || "";

            switch (name)
            {
                case "translate" :
                    if (action.length == 2)
                        result += "translate(" + action[0] + unit + "," + action[1] + unit +  ") ";
                    else if (action.length == 3)
                        result += "translate3d(" + action[0] + unit + "," + action[1] + unit + "," + action[2] + unit + ") ";
                    break;
                case "rotate" :
                    if (typeof action == "number")
                        result += "rotate(" + action + unit + ") ";
                    else if (Array.isArray(action))
                    {
                        if (action[0] != 0) result += "rotateX(" + action[0] + unit + ") ";
                        if (action[1] != 0) result += "rotateY(" + action[1] + unit + ") ";
                        if (action[2] != 0) result += "rotateZ(" + action[2] + unit + ") ";
                    }
                    break;
                case "scale" :
                    if (typeof action == "number")
                        result += "scale(" + action + ") ";
                    else if (Array.isArray(action))
                        result += "scale(" + action[0] + "," + action[1] +  ") ";
                    break;
                case "skew" :
                    if (typeof action == "number")
                        result += "skew(" + action + unit + ") ";
                    else if (Array.isArray(action))
                        result += "skew(" + action[0] + unit + "," + action[1] + unit +  ") ";
                    break;
                case "perspective" :
                    result += "perspective(" + action + unit + ") ";
            }

            if (result) result += " ";
        }

        return result;
    }

    get attr()
    {
        var self = this;

        return {
            get : function(name)
            {
                var result;

                if (self.elements.length == 1)
                    result = self._getAttributes(self.elements[0], name);

                return result;
            },
            set : function(attrs)
            {
                if (typeof attrs == "string")
                {
                    self.elements.forEach(function(element){
                        element.setAttribute(attrs, "");
                    });
                }
                else
                {
                    var result = [];

                    self.elements.forEach(function(element){
                        for (var i in attrs)
                            element.setAttribute(i, attrs[i]);
                    });
                }

                return self;
            },
            unset : function(attrs)
            {
                if (typeof attrs == "string")
                {
                    self.elements.forEach(function(element){
                        element.removeAttribute(attrs);
                    });
                }
                else if (Array.isArray(attrs))
                {
                    var result = [];

                    self.elements.forEach(function(element){
                        attrs.forEach(function(attr){
                            element.removeAttribute(attr);
                        });
                    });
                }
                else if (attrs == undefined)
                {
                    attrs = self.attr.get();

                    if (attrs)
                    {
                        self.elements.forEach(function(element){
                            for (var i in attrs)
                                element.removeAttribute(i);
                        });
                    }
                }

                return self;
            }
        };
    }

    _getAttributes(element, list)
    {
        if (element !== undefined && element.nodeType == 1 && element.attributes.length)
        {
            var attributes = {};

            if (list)
            {
                if (Array.isArray(list))
                    list.forEach(function(name){
                        var attribute = element.getAttribute(name);
                        if (attribute) attributes[name] = attribute;
                    });

                else if (typeof list == "string")
                    attributes = element.getAttribute(list);

                else return;
            }
            else
            {
                [].forEach.call(element.attributes, function (attribute) {
                    attributes[attribute.name] = attribute.value;
                }); 
            }

            if (attributes) return attributes;
            else return false;
        }
        else return false;
    }

    css(styles)
    {
        if (typeof styles == "string")
            return this.elements[0].style[styles];

        else
        {
            this.elements.forEach(function(element){
                for (var name in styles)
                    element.style[name] = styles[name];
            });

            return this;
        }
    }

    get event()
    {

        var self = this;

        return {
            attach : function(list)
            {
                var eventList;

                if (!DOC._eventList[self._id])
                    DOC._eventList[self._id] = {};

                eventList = DOC._eventList[self._id];

                for (var event in list)
                {
                    if (!eventList[event])
                        eventList[event] = superFunction(list[event]);

                    else eventList[event].push(list[event]);

                    var evAttr = {}
                    evAttr["on" + event] = "DOC._startEventFunc(" + self._id + ", '" + event + "', event)";
                    self.attr.set(evAttr);
                }

                return self;
            },
            dispatch(type)
            {
                var event = new Event(type);

                self.elements.forEach(function(element){
                    element.dispatchEvent(event);
                });
            },
            run : function(type)
            {
                DOC._startEventFunc(self._id, type);
            },
            detach : function()
            {

            }
        }
    }

    get json()
    {
        var self = this;

        return {
            before : function(json)
            {
                return self._insertJson(json, self._getInsertMethod("before"));
            },
            after : function(json)
            {
                return self._insertJson(json, self._getInsertMethod("after"));
            },
            prepend : function(json)
            {
                return self._insertJson(json, self._getInsertMethod("prepend"));
            },
            append : function(json)
            {
                return self._insertJson(json, self._getInsertMethod("append"));
            },
            get : function(element)
            {
                if (element)
                    return jsonConverter.convert(element);

                else if (self.elements.length)
                {
                    var result;

                    if (self.elements.length == 1)
                        result = jsonConverter.convert(self.elements[0]);

                    else
                    {
                        result = [];
                        self.elements.forEach(function(element){
                            result.push(jsonConverter.convert(element));
                        });
                    }   

                    return result;
                }
                else return false;
            }
        }
    }

    _insertJson(json, method)
    {
        var self = this, clones = [];

        jsonConverter.wrap(json);

        this.elements.forEach(function(current){
            var element = jsonConverter.build(json);
            clones.push(element);
            method(element, current);
        });

        return new DocumentTools(clones);
    }

    each(fn)
    {
        this.elements.forEach(function(element, index, array){
            fn(DOC.convert(element), index, array);
        });

        return this;
    }

    clone()
    {
        var self = this, clones = [];

        this.elements.forEach(function(element){
            clones.push(element.cloneNode(true));
        });

        return new DocumentTools(clones);
    }

    convert(elements)
    {
        if (elements.nodeType == 1 || elements.nodeType == 9)
            return new DocumentTools(elements);

        else if (elements.isDocTool)
            return elements;

        else return false;
    }

    merge(doc)
    {
        this.elements = this.elements.concat(doc.elements);
        return this;
    }

    clear()
    {
        this.html("");
    }

    remove()
    {
        var self = this;

        this.elements.forEach(function(element, index){
            if (element.parentNode)
                element.parentNode.removeChild(element);

            self.elements.$remove.index(index);
        });
    }
}