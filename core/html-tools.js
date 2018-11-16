import {printErr} from './functions';
import JSONConverter from './json-converter';
import Transform from './transform';
import MegaFunction from './mega-function';
import Async from './async';

export let eventList = {};

export class HTMLTools
{
    constructor(source)
    {
        if (source)
            this.elements = source instanceof NodeList || Array.isArray(source)
            ? source : [source];

        else this.elements = [];

        this._srcLength = this.elements.length;
        this.query = '';
        this._id = Math.random();
        this._ready = false;
    }

    native()
    {
        return this.elements.length == 1 ? this.elements[0] : Array.from(this.elements);
    }

    get length()
    {
        return this.elements.length > this._srcLength
        ? this.elements.length - this._srcLength
        : this._srcLength;
    }

    get tag()
    {
        return this.elements[0].tagName.toLowerCase();
    }

    get isHTMLTools()
    {
        return true;
    }

    ready(fn)
    {
        let self = this,
            result = new Async(),
            list = this.select("img, link, script, iframe"),

        checkout = function()
        {
            list._countReady++;

            if (list._countReady == list.length)
            {
                result.resolve();
                if (typeof fn == "function") fn();
            }
        }

        list = list.join(this.elements).elements;
        list._countReady = 0;
        list.forEach( element => {

            let tag = element.tagName.toLowerCase(),
                errorText = `Can't load resource "${element.src}"`,
                complete = true;
                
            if (tag == "img")
            {
                complete = element.complete;

                if (complete && !element.width && !element.height)
                {
                    result.reject(errorText);
                    return;
                }
            }

            else if (tag == "link" || tag == "iframe")
                complete = false;

            if (complete) checkout();
            else
            {
                element.addEventListener("load", checkout);
                element.addEventListener("error", (e) => result.reject(e));
            }

        });

        return result;
    }

    mutation(fn, options, replace)
    {
        if (!("MutationObserver" in window))
        {
            printErr("Your browser not support observ mutation");
            return;
        }
        
        if (replace) this.mutationClear();

        this._mutations = [];

        for (let i = 0; i < this.elements.length; i++)
        {
            let observer = new MutationObserver(function(data){
                fn(data[0]);
            });

            observer.observe(this.elements[i], options);

            this._mutations.push({
                observer : observer, 
                element  : this.elements[i],
                options  : options
            });
        }
        
        return this;
    }

    mutationStart()
    {
        for (let i = 0; i < this._mutations.length; i++)
        {
            let mutation = this._mutations[i];
            mutation.observer.observe(mutation.element, mutation.options);
        }
    }

    mutationEnd()
    {
        for (let i = 0; i < this._mutations.length; i++)
            this._mutations[i].observer.disconnect();
    }

    mutationClear()
    {
        for (let i = 0; i < this._mutations.length; i++)
            this._mutations[i].observer.disconnect();

        delete this._mutations;
    }

    visible(maxDepth = 3)
    {
        let found = this._findHidden(this.elements[0], maxDepth, 0)
        return found ? { element : found } : {}
    }

    _findHidden(element, maxDepth, depth)
    {
        if (depth >= maxDepth) return false;

        let result = false,
            parent = element.parentElement || element.parentNode || null;

        if (parent && parent != document)
            result = !this.display(parent) ? parent : this._findHidden(parent, maxDepth, ++depth);

        return result;
    }

    display(element)
    {
        let display;

        if (!element) element = this.elements[0]

        display = element.style.display
        ? element.style.display
        : getComputedStyle(element).display;

        return display !== "none";
    }

    select(query)
    {
        let elements = [], result;

        if (this.elements.length == 1)
            elements = this.elements[0].querySelectorAll(query);

        else for (let i = 0; i < this.elements.length; i++)
        {
            let search = this.elements[i].querySelectorAll(query),
                index = elements.length;

            for (let j = 0; j < search.length; j++)
                elements[index + j] = search[j];
        }

        result = new HTMLTools(elements);
        result.query = query;

        return result;
    }

    before(htl, remove)
    {
        this._insert(htl, remove, "beforebegin");
        return this;
    }

    after(htl, remove)
    {
        this._insert(htl, remove, "afterend");
        return this;
    }

    append(htl, remove)
    {
        this._insert(htl, remove, "beforeend");
        return this;
    }

    appendTo(target, remove)
    {
        target.append(this, remove);
        return this;
    }

    prepend(htl, remove)
    {
        this._insert(htl, remove, "afterbegin");
        return this;
    }

    _insert(htl, remove, position)
    {
        if (htl.isHTMLTools)
        {
            if (htl._jsonConv)
            {
                this._insertJSON(htl, "beforeend");
                return;
            }

            if (!Array.isArray(htl.elements)) // need for speed, because Array.from is very slow
                htl.elements = Array.from(htl.elements);

            for (let i = 0; i < this.elements.length; i++)
            for (let j = 0; j < htl._srcLength; j++)
            {
                let element = htl.elements[j];

                if (!remove)
                {
                    element = htl.elements[j].cloneNode(true);
                    htl.elements.push(element);
                }

                this.elements[i].insertAdjacentElement(position, element);
            }
        }
        else if (Array.isArray(htl))
        {
            for (let i = 0; i < htl.length; i++)
                this._insert(htl[i], remove, position);
        }
    }

    _insertJSON(htl, position)
    {
        for (let i = 0; i < this.elements.length; i++)
        {
            let element = htl._jsonConv.build();
            htl.elements.push(element);
            this.elements[i].insertAdjacentElement(position, element);
        }
    }

    createFromJSON(json)
    {
        let jsonConv = new JSONConverter(json),
            result = jsonConv.htl;
            result._jsonConv = jsonConv;
            result.node = jsonConv.nodes;
            
        return result;
    }

    createJSON(htl)
    {
        let elements = htl ? htl.elements : this.elements,
            result;

        if (elements.length > 1)
        {
            result = [];
            elements.forEach( element => {
                result.push(JSONConverter.createJSON(element))
            });
        }
        else result = JSONConverter.createJSON(elements[0]);

        return result;
    }

    tplAppend(tpl)
    {
        return tpl.isTemplate ? tpl.appendTo(this) : false;
    }

    addClass(name)
    {
        for (let i = 0; i < this.elements.length; i++)
            this.elements[i].classList.add(name);

        return this;
    }

    removeClass(name)
    {
        for (let i = 0; i < this.elements.length; i++)
            this.elements[i].classList.remove(name);

        return this;
    }

    html(str, clear = true)
    {
        if (str !== undefined)
            for (let i = 0; i < this.elements.length; i++)
            {
                if (clear) this.elements[i].innerHTML = str;
                else this.elements[i].innerHTML += str;
            }

        else return this.elements[0].innerHTML;

        return this;
    }

    text(str)
    {
        if (str !== undefined)
            for (let i = 0; i < this.elements.length; i++)
                this.elements[i].innerText = str;

        else return this.elements[0].innerText;

        return this;
    }

    value(data)
    {
        if (data !== undefined)
        {
            for (let i = 0; i < this.elements.length; i++)
                this.elements[i].value = data;
        }
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
            for (let i = 0; i < this.elements.length; i++)
            {
                if ("checked" in this.elements[i])
                    this.elements[i].checked = yes;
            }

        else if (yes == undefined)
            return this.elements[0].checked;

        return this;
    }

    toogle()
    {
        for (let i = 0; i < this.elements.length; i++)
        {
            if ("checked" in this.elements[i])
                this.elements[i].checked = !this.elements[i].checked;
        }

        return this;
    }

    get index()
    {
        return this.elements[0].selectedIndex;
    }

    choose(index)
    {
        for (let i = 0; i < this.elements.length; i++)
        {
            if ("selectedIndex" in this.elements[i])
                this.elements[i].selectedIndex = index;
        }

        return this;
    }

    width(value)
    {
        if (value === undefined)
            return this.elements[0].offsetWidth;

        if (typeof value == "number")
            value += "px";

        for (let i = 0; i < this.elements.length; i++)
            this.elements[i].style.width = value;
        
        return this;
    }

    height(value)
    {
        if (value === undefined)
            return this.elements[0].offsetHeight;

        if (typeof value == "number")
            value += "px";

        for (let i = 0; i < this.elements.length; i++)
            this.elements[i].style.height = value;

        return this;
    }

    offsetParent()
    {
        let element = this.elements[0];
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
        let element = this.elements[0];
        return {
            top  : element.scrollTop,
            left : element.scrollLeft
        }
    }

    offsetPage()
    {
        let element = this.elements[0],
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

    wrap(classList, revOrder)
    {
        if (typeof classList == "string")
        {
            let result = [],
                wrapper = document.createElement("div"); 
                wrapper.classList.add(classList);

            for (let i = 0; i < this.elements.length; i++)
            {
                let element = this.elements[i],
                    wrapClone = wrapper.cloneNode();

                element.parentNode.insertBefore(wrapClone, element);
                wrapClone.appendChild(element);

                result.push(wrapClone);
            }

            return new HTMLTools(result);
        }
        else if (Array.isArray(classList))
        {
            let result;

            if (!revOrder)
            {
                result = this.wrap(classList[0]);
                for (let i = 1; i < classList.length; i++)
                    this.wrap(classList[i]);
            }
            else
            {
                result = this.wrap(classList[classList.length - 1]);
                for (let i = classList.length - 2; i >= 0; i--)
                    this.wrap(classList[i]);
            }

            return result;
        }
    }

    hide()
    {
        for (let i = 0; i < this.elements.length; i++)
            this.elements[i].style.display = "none";

        return this;
    }

    show(disp = "")
    {
        for (let i = 0; i < this.elements.length; i++)
            this.elements[i].style.display = disp;

        return this;
    }

    parent()
    {
        let parents = [];

        for (let i = 0; i < this.elements.length; i++)
            parents.push(this.elements[i].parentElement || this.elements[i].parentNode || null)

        return new HTMLTools(parents);
    }

    transform(data)
    {
        let transform = new Transform(this);
            transform.apply(data);
            
        return transform;
    }

    getAttr(name)
    {
        let element = this.elements[0],
            result;

        if (!element)
        {
            printErr(`Can't get attribute of undefined element`);
            return;
        }

        if (element.nodeType == 1 && element.attributes.length)
        {
            result = {};

            if (typeof name == "string")
                result = element.getAttribute(name);

            else if (Array.isArray(name))
                for (let i = 0; i < name.length; i++)
                {
                    let attr = element.getAttribute(item);
                    if (attr) result[item] = attr;
                }
            
            else if (!name)
                for (let i = 0; i < element.attributes.length; i++)
                {
                    let attr = element.attributes[i];
                    result[attr.name] = attr.value;
                }
        }

        return result;
    }

    setAttr(attr, value)
    {
        if (typeof attr == "string" && value !== undefined)
            for (let i = 0; i < this.elements.length; i++)
                this.elements[i].setAttribute(attr, value)

        else if (typeof attr == "object")
            for (let i = 0; i < this.elements.length; i++)
            {
                for (let n in attr)
                    this.elements[i].setAttribute(n, attr[n])
            }

        return this;
    }

    unsetAttr(name)
    {
        if (typeof name == "string")
            for (let i = 0; i < this.elements.length; i++)
                this.elements[i].removeAttribute(name)

        else if (Array.isArray(name))
            for (let i = 0; i < this.elements.length; i++)
            {
                for (let j = 0; j < name.length; j++)
                    this.elements[i].removeAttribute(name[j])
            }

        else if (name == undefined)
        {
            let list = this.getAttr();
            
            if (list)
                for (let i = 0; i < this.elements.length; i++)
                {
                    for (let item in list)
                        this.elements[i].removeAttribute(item)
                }
        }

        return this;
    }

    style(name, value)
    {
        if (typeof name == "string" && value !== undefined)
            for (let i = 0; i < this.elements.length; i++)
                this.elements[i].style[name] = value;

        else if (typeof name == "object")
            for (let i = 0; i < this.elements.length; i++)
            {
                for (let item in name)
                    this.elements[i].style[item] = name[item];
            }

        else if (typeof name == "string" && value == undefined)
            return this.elements[0].style[name];

        return this;
    }

    eventAttach(data, fn)
    {
        if (!eventList[this._id])
            eventList[this._id] = {};

        let list = eventList[this._id];

        if (typeof data == "string" && fn !== undefined)
            this._eventAttach(list, data, fn);

        else if (typeof data == "object")
        {
            for (let event in data)
                this._eventAttach(list, event, data[event]);
        }

        return this;
    }

    eventDispatch(type)
    {
        let event = new Event(type);

        for (let i = 0; i < this.elements.length; i++)
            this.elements[i].dispatchEvent(event)

        return this;
    }

    eventDetach(type)
    {
        let list = eventList[this._id];

        if (type)
        {
            for (let event in list)
                this.elements.unsetAttr(event.substr(0, 2));
        }
        else eventList[this._id][type] = undefined;

        return this;
    }

    _eventAttach(list, type, fn)
    {
        if (list[type]) list[type].push(fn);
        else list[type] = new MegaFunction(fn);

        this.setAttr("on" + type, "$html._eventStart(" + this._id + ",'" + type + "',event)");
    }

    each(fn)
    {
        for (let i = 0; i < this.elements.length; i++)
            fn(this.elements[i], i, this);

        return this;
    }

    clone(deep)
    {
        let clones = [];

        for (let i = 0; i < this.elements.length; i++)
            clones.push(this.elements[i].cloneNode(deep))

        return new HTMLTools(clones);
    }

    join(source)
    {
        let elemList;

        if (!source)
        {
            printErr(`Can't attach the invalid elements (${source})`);
            return;
        }

        this.elements = Array.from(this.elements);

        if (source.isHTMLTools)
            elemList = source.elements;

        else if (source instanceof NodeList || Array.isArray(source))
            elemList = source;

        else elemList = [source];

        for (let i = 0; i < elemList.length; i++)
            this.elements.push(elemList[i]);

        return this;
    }

    clear()
    {
        for (let i = 0; i < this.elements.length; i++)
            this.elements[i].innerHTML = "";
    }

    remove()
    {
        for (let i = 0; i < this.elements.length; i++)
        {
            let element = this.elements[i];

            if (element.parentNode)
                element.parentNode.removeChild(element);
        }

        this.elements = [];
        this._srcLength = 0;

        return this;
    }
}