import {jsonConverter} from './json-converter';
import {Transform} from './transform';
import {Async} from './async';
import {MegaFunction} from './mega-function';
import {random} from './functions';
import {arrayExtends} from './array';

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
            for (var i = 0; i < elements.length; i++)
                this.elements.push(elements[i]);

        else this.elements = this.elements.concat(elements);
        
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
        var fn, sub, list = this.elements;

        arguments.length == 1
        ? fn = arguments[0]
        : (sub = arguments[0], fn = arguments[1]);

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

        checkout = function(){
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

    visible(maxDepth = 3)
    {
        var found = this._findHidden(this.elements[0], maxDepth, 0)
        return found ? { element : found } : {}
    }

    _findHidden(element, maxDepth, depth)
    {
        if (depth >= maxDepth) return false;

        var result = false,
            parent = element.parentElement || element.parentNode || null;

        if (parent && parent != document)
            result = !this.display(parent) ? parent : this._findHidden(parent, maxDepth, ++depth);

        return result;
    }

    display(element)
    {
        var display;

        if (!element) element = this.elements[0]

        element.style.display
        ? display = element.style.display
        : display = getComputedStyle(element).display;

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

    before(htl, rm = true)
    {
        return this._insert(htl, rm, "beforebegin");
    }

    after(htl, rm = true)
    {
        return this._insert(htl, rm, "afterend");
    }

    append(htl, rm = true)
    {
        return this._insert(htl, rm, "beforeend");
    }

    appendTo(target, rm = true)
    {
        target.append(this, rm);
        return this;
    }

    prepend(htl, rm = true)
    {
        return this._insert(htl, rm, "afterbegin");
    }

    _insert(htl, rm, position)
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
                    element.insertAdjacentElement(position, clone);
                });
                result = result.concat(clones);
            });

            if (rm) htl.remove();

            htl.addElements(result);

            return htl;
        }
        else return false;
    }

    jsonBefore(json)
    {
        return this._insertJson(json, "beforebegin");
    }

    jsonAfter(json)
    {
        return this._insertJson(json, "afterend");
    }

    jsonAppend(json)
    {
        return this._insertJson(json, "beforeend");
    }

    jsonPrepend(json)
    {
        return this._insertJson(json, "afterbegin");
    }

    jsonGet(element)
    {
        var result = [];

        if (element)
            result = jsonConverter.getFromHTML(element);

        else if (this.elements.length)
            this.elements.length == 1
            ? result = jsonConverter.getFromHTML(this.elements[0])
            : this.elements.forEach( element => result.push(jsonConverter.getFromHTML(element)) );

        else result = false;

        return result;
    }

    _insertJson(json, position)
    {
        var clones = [];

        jsonConverter.toHTML(json);

        this.elements.forEach( current => {
            var element = jsonConverter.build(json);
            clones.push(element);
            current.insertAdjacentElement(position, element);
        });

        return new HTMLTools(clones);
    }

    tplAppend(tpl)
    {
        return tpl.isTemplate ? tpl.appendTo(this) : false;
    }

    addClass(name)
    {
        this.elements.forEach( element => element.classList.add(name) );
        return this;
    }

    removeClass(name)
    {
        this.elements.forEach( element => element.classList.remove(name) );
        return this;
    }

    html(str, clear = true)
    {
        if (str !== undefined)
            this.elements.forEach( element => {
                clear ? element.innerHTML = str : element.innerHTML += str
            })

        else return this.elements[0].innerHTML;

        return this;
    }

    text(str)
    {
        if (str !== undefined)
            this.elements.forEach( element => element.innerText = str );

        else return this.elements[0].innerText;

        return this;
    }

    value(data)
    {
        if (data !== undefined)
            this.elements.forEach( element => element.value = data );
        else return this.elements[0].value;

        return this;
    }

    active(yes)
    {
        yes ? this.addClass("active") : this.removeClass("active");

        return this;
    }

    checked(yes)
    {
        if (typeof yes == "boolean")
            this.elements.forEach( element => {
                if ("checked" in element) element.checked = yes
            });

        else if (yes == undefined)
            return this.elements[0].checked;

        return this;
    }

    toogle()
    {
        this.elements.forEach( element => {
            if ("checked" in element)
                element.checked = element.checked ? false : true;
        });

        return this;
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

        return this;
    }

    width(value, units = "px")
    {
        if (typeof value == "number")
            this.elements.forEach( element => element.style.width = value + units );

        else return this.elements[0].offsetWidth;

        return this;
    }

    height(value, units = "px")
    {
        if (typeof value == "number")
            this.elements.forEach( element => element.style.height = value + units );

        else return this.elements[0].offsetHeight;

        return this;
    }

    offsetParent()
    {
        var element = this.elements[0];
        return {
            top  : element.offsetTop,
            left : element.offsetLeft
        }
    }

    offsetWindow()
    {
        return this.elements[0].getBoundingClientRect();
    }

    offsetScroll()
    {
        var element = this.elements[0];
        return {
            top  : element.scrollTop,
            left : element.scrollLeft
        }
    }

    offsetPage()
    {
        var element = this.elements[0],
            rect = element.getBoundingClientRect(),
            doc  = document.documentElement,
            top  = rect.top + window.pageYOffset - doc.clientTop,
            left = rect.left + window.pageXOffset - doc.clientLeft;
        
        return {
            top   : Math.round(top),
            left  : Math.round(left),
            bottom: Math.round(top + element.offsetHeight),
            right : Math.round(left + element.offsetWidth)
        }
    }

    scroll()
    {

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
            var wrapper = $html.create("div", classList[0]),
                inside = "";

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
        return element.parentElement || element.parentNode || null;
    }

    transform(data)
    {
        var transform = new Transform(this);
            transform.apply(data);
            
        return transform;
    }

    getAttr(name)
    {
        var element = this.elements[0],
            result;

        if (element !== undefined && element.nodeType == 1 && element.attributes.length)
        {
            result = {}

            if (name)
            {
                if (Array.isArray(name))
                    name.forEach( item => {
                        var value = element.getAttribute(item);
                        if (value) result[item] = value;
                    });

                else if (typeof name == "string")
                    result = element.getAttribute(name);
            }
            else
                [].forEach.call(
                    element.attributes,
                    attr => result[attr.name] = attr.value
                );
        }

        return result;
    }

    setAttr(attrs, value)
    {
        if (typeof attrs == "string" && value !== undefined)
            this.elements.forEach( element => element.setAttribute(attrs, value) )

        else this.elements.forEach( element => {
            for (var i in attrs) element.setAttribute(i, attrs[i])
        });

        return this;
    }

    unsetAttr(name)
    {
        if (typeof name == "string")
            this.elements.forEach( element => element.removeAttribute(name) )

        else if (Array.isArray(name))
            this.elements.forEach( element => {
                name.forEach( attr => element.removeAttribute(attr) )
            })

        else if (name == undefined)
        {
            var list = this.getAttr();
            if (list) this.elements.forEach( element => {
                for (var i in list) element.removeAttribute(i)
            });
        }

        return this;
    }

    css(styles)
    {
        if (typeof styles == "string")
            return this.elements[0].style[styles];

        else this.elements.forEach( element => {
            for (var name in styles) element.style[name] = styles[name];
        });

        return this;
    }

    eventAttach(data, fn)
    {
        if (!$html._eventList[this._id])
            $html._eventList[this._id] = {};

        var list = $html._eventList[this._id];

        if (typeof data == "string" && fn !== undefined)
            this._eventAttach(list, data, fn);

        else if (typeof data == "object")
            for (var event in data)
                this._eventAttach(list, event, data[event]);

        return this;
    }

    eventDispatch(type)
    {
        var event = new Event(type);
        this.elements.forEach( element => element.dispatchEvent(event) );

        return this;
    }

    eventStart(type)
    {
        $html._eventFunction(this._id, type);
        return this;
    }

    eventDetach(name)
    {
        var list = $html._eventList[this._id];

        if (name)
            for (var event in list)
                this.elements.unsetAttr(event.substr(0, 2));
        
        else $html._eventList[this._id][name] = undefined;

        return this;
    }

    _eventAttach(list, name, fn)
    {
        var evAttr = {}

        list[name]
        ? list[name].push(fn)
        : list[name] = new MegaFunction(fn);

        evAttr["on" + name] = "$html._eventFunction(" + this._id + ", '" + name + "', event)";

        this.setAttr(evAttr);
    }

    each(fn)
    {
        this.elements.forEach((element, index, array) =>
            fn($html.convert(element), index, array));

        return this;
    }

    clone()
    {
        var clones = [];

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
        this.elements.forEach( (element, index) => {
            if (element.parentNode)
                element.parentNode.removeChild(element);

            arrayExtends.removeIndex(this.elements, index);
        });
    }
}