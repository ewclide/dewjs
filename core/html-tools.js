import {JsonConverter} from './json-converter';
import {Transform}     from './transform';
import {Animation}     from './animation';
import {Async}         from './async';

var jsonConverter = new JsonConverter();

export class HTMLTools extends Async
{
    constructor(elements)
    {
        super();

        this.elements = [];
        this.length = 0;
        this._id = random();
        this._query = '';

        this.addElements(elements);
    }

    addElements(elements)
    {
        if (!Array.isArray(elements) && elements.length)
        {
            for (var i = 0; i < elements.length; i++)
                this.elements.push(elements[i]);
        }
        else
        {
            this.elements = this.elements.concat(elements);
        }

        this.length = this.elements.length;
    }

    get tag()
    {
        return this.elements[0].tagName.toLowerCase();
    }

    get isHTMLTools()
    {
        return true;
    }

    ready()
    {
        var fn, sub,
            list = this.elements;

        if (arguments.length == 1)
            fn = arguments[0];

        else
        {
            sub = arguments[0];
            fn = arguments[1];
        }

        if (sub)
        {
            sub = this.select("img, link, script, iframe");
            list = list.concat(sub.elements);
        }

        this.then(fn);

        this._observReady(list);

        return this;
    }

    _observReady(list)
    {
        var self = this,

        checkout = function()
        {
            list._countReady++;
            if (list._countReady == list.length)
                self.resolve();
        }

        list._countReady = 0;

        list.forEach( element => {

            var tag = element.tagName.toLowerCase(),
                complete = true;
                
            if (tag == "img")
                complete = element.complete;

            else if (tag == "link" || tag == "iframe")
                complete = false;

            complete ? checkout() : element.addEventListener("load", checkout);

        }); 
    }

    mutation(fn, options)
    {
        if ("MutationObserver" in window && !element._observer)
        {
            this.mutations = [];
            this.elements.forEach( element => this._observMutation(element, fn, options) );
        }
    }

    _observMutation(element, fn, options)
    {
        var mutation = new MutationObserver(function(mutations){
            fn(mutations);
        });

        mutation.observe(element, options);

       this.mutations.push(mutation);
    }

    isVisible(maxDepth = 3)
    {
        return this._checkVisible(this.elements[0], maxDepth);
    }

    _checkVisible(element, maxDepth, depth = 0)
    {
        if (depth >= maxDepth) return result;

        var parent = element.parentElement || element.parentNode || null;

        if (parent && parent != document)
        {
            this.display(parent)
            ? result = parent
            : result = this._checkVisible(parent, maxDepth, depth++);
        }

        return result;
    }

    display(element)
    {
        var display;

        element.style.display
        ? display = element.style.display : display = element.getComputedStyle().display;

        return display == "none" ? false : true;
    }

    select(query)
    {
        var elements = [], result;

        this.elements.forEach( element => {
            var search = element.querySelectorAll(query);
            elements = elements.concat(Array.from(search));
        });

        result = new HTMLTools(elements);
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

    before(htl, rm = true)
    {
        return this._insert(htl, rm, this._getInsertMethod("before"));
    }

    after(htl, rm = true)
    {
        return this._insert(htl, rm, this._getInsertMethod("after"));
    }

    append(htl, rm = true)
    {
        return this._insert(htl, rm, this._getInsertMethod("append"));
    }

    appendTo(target, rm = true)
    {
        target.append(this, rm);
        return this;
    }

    prepend(htl, rm = true)
    {
        return this._insert(htl, rm, this._getInsertMethod("prepend"));
    }

    _insert(htl, rm, method)
    {
        var self = this, result = [];

        htl = $html.convert(htl);

        if (htl)
        {
            this.elements.forEach( element => {

                var clones = [];

                htl.elements.forEach( insertElement => {
                    var clone = insertElement.cloneNode(true);
                    clones.push(clone);
                    method(clone, element);
                });

                result = result.concat(clones);
            });

            if (rm) htl.remove();

            htl.addElements(result);

            return htl;
        }
        else return false;
    }

    addClass(name)
    {
        this.elements.forEach( element => element.classList.add(name) );
    }

    removeClass(name)
    {
        this.elements.forEach( element => element.classList.remove(name) );
    }

    html(str, clear = true)
    {
        if (str !== undefined)
        {
            this.elements.forEach( element => {
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
            this.elements.forEach( element => element.innerText = str );
            return this;
        }
        else return this.elements[0].innerText;
    }

    value(data)
    {
        if (data !== undefined)
        {
            this.elements.forEach( element => element.value = data );
            return this;
        }
        else return this.elements[0].value;
    }

    active(yes)
    {
        if (yes) this.addClass("active");
        else this.removeClass("active");
    }

    checked(yes)
    {
        if (typeof yes == "boolean")
            this.elements.forEach( element => {
                if ("checked" in element) element.checked = yes;
            });

        else if (yes == undefined)
            return this.elements[0].checked;
    }

    toogle()
    {
        this.elements.forEach( element => {
            if ("checked" in element)
                element.checked ? element.checked = false : element.checked = true;
        });
    }

    get index()
    {
        return this.elements[0].selectedIndex;
    }

    choose(index)
    {
        this.elements.forEach( element => {
            if ("selectedIndex" in element) element.selectedIndex = index;
        });
    }

    width(value)
    {
        if (typeof value == "number")
            this.elements.forEach( element => element.style.width = value + "px" );

        else return this.elements[0].offsetWidth;
    }

    height(value)
    {
        if (typeof value == "number")
            this.elements.forEach( element => element.style.height = value + "px" );

        else return this.elements[0].offsetHeight;
    }

    wrap(classList)
    {
        if (typeof classList == "string")
        {
            var wrapper = $html.create("div", classList);

            this.after(wrapper);
            wrapper.append(this);

            return wrapper;
        }
        else if (Array.isArray(classList))
        {
            var wrapper = $html.create("div", classList[0]), inside = "";

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

    parent()
    {
        var parents = [];

        this.elements.forEach( element => parents.push(this._getParent(element)) );

        return new HTMLTools(parents);
    }

    _getParent(element)
    { 
        var parent = element.parentElement || element.parentNode || null;
        return parent;
    }

    transform(data)
    {
        var transform = new Transform(this);
            transform.apply(data);
            
        return transform;
    }

    animate(data, settings)
    {
        var animation = new Animation(this);
        
        if (data && settings)
            animation.key(data, settings);
            
        return animation;
    }

    get attr()
    {
        var self = this;

        return {
            get : function(name)
            {
                if (self.elements.length == 1)
                    return self._getAttributes(self.elements[0], name);
            },
            set : function(attrs, value)
            {
                if (typeof attrs == "string" && value !== undefined)
                    self.elements.forEach( element => element.setAttribute(attrs, value) );

                else self.elements.forEach( element => {
                        for (var i in attrs)
                            element.setAttribute(i, attrs[i]);
                    });

                return self;
            },
            unset : function(attrs)
            {
                if (typeof attrs == "string")
                    self.elements.forEach( element => element.removeAttribute(attrs) );

                else if (Array.isArray(attrs))
                    self.elements.forEach( element => attrs.forEach( attr => element.removeAttribute(attr) ) );

                else if (attrs == undefined)
                {
                    attrs = self.attr.get();

                    if (attrs)
                        self.elements.forEach( element => {
                            for (var i in attrs) element.removeAttribute(i);
                        });
                }

                return self;
            }
        };
    }

    _getAttributes(element, list)
    {
        if (element !== undefined && element.nodeType == 1 && element.attributes.length)
        {
            var attributes;

            if (list)
            {
                if (Array.isArray(list))
                {
                    attributes = {};

                    list.forEach( name => {
                        var value = element.getAttribute(name);
                        if (value) attributes[name] = value;
                    });
                }
                else if (typeof list == "string")
                    attributes = element.getAttribute(list);
            }
            else
            {
                attributes = {};

                [].forEach.call(element.attributes,  attr => attributes[attr.name] = attr.value ); 
            }
            
            return attributes;
        }
    }

    css(styles)
    {
        if (typeof styles == "string")
            return this.elements[0].style[styles];

        else
        {
            this.elements.forEach( element => {
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
            attach : function(data, fn)
            {
                if (!$html._eventList[self._id])
                    $html._eventList[self._id] = {};

                var list = $html._eventList[self._id];

                if (typeof data == "string" && fn !== undefined)
                    self._attachEvent(list, data, fn);

                else if (typeof data == "object")
                    for (var event in data)
                        self._attachEvent(list, event, data[event]);

                return self;
            },
            dispatch(type)
            {
                var event = new Event(type);

                self.elements.forEach( element => element.dispatchEvent(event) );

                return self;
            },
            start : function(type)
            {
                $html._eventFunction(self._id, type);

                return self;
            },
            detach : function(name)
            {
                var list = $html._eventList[self._id];

                if (!name)
                {
                    for (var event in list)
                        self.elements.attr.unset(event.substr(0, 2));
                }
                else $html._eventList[self._id][name] = undefined;

                return self;
            }
        }
    }

    _attachEvent(list, name, fn)
    {
        var evAttr = {}

        list[name] ? list[name].push(fn) : list[name] = superFunction(fn);
        
        evAttr["on" + name] = "$html._eventFunction(" + this._id + ", '" + name + "', event)";

        this.attr.set(evAttr);
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
                    return jsonConverter.fromHTML(element);

                else if (self.elements.length)
                {
                    var result;

                    if (self.elements.length == 1)
                        result = jsonConverter.fromHTML(self.elements[0]);

                    else
                    {
                        result = [];
                        self.elements.forEach( element => result.push(jsonConverter.fromHTML(element)) );
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

        jsonConverter.toHTML(json);

        this.elements.forEach( current => {
            var element = jsonConverter.build(json);
            clones.push(element);
            method(element, current);
        });

        return new HTMLTools(clones);
    }

    each(fn)
    {
        this.elements.forEach(
            (element, index, array) => fn($html.convert(element), index, array)
        );

        return this;
    }

    clone()
    {
        var self = this, clones = [];

        this.elements.forEach( element => clones.push(element.cloneNode(true)) );

        return new HTMLTools(clones);
    }

    merge(htl)
    {
        this.elements = this.elements.concat(htl.elements);
        return this;
    }

    clear()
    {
        this.html("");
    }

    remove()
    {
        var self = this;

        this.elements.forEach( (element, index) => {
            if (element.parentNode)
                element.parentNode.removeChild(element);

            self.elements.$remove.index(index);
        });
    }
}