import {printErr} from './functions';
import JSONConverter from './json-converter';
import CSSTransformer from './css-transformer';
import CallBacker from './callbacker';

export let eventList = {};

export class HTMLTools
{
    constructor(source) {
        if (source) {
            this.elements = source instanceof NodeList || Array.isArray(source) ? source : [source];
        } else {
            this.elements = [];
        }

        this._srcLength = this.elements.length;
        this.query = '';
        this._id = Math.random();
        this._ready = false;
    }

    native() {
        return this.elements.length == 1 ? this.elements[0] : Array.from(this.elements);
    }

    get length() {
        return this.elements.length > this._srcLength
        ? this.elements.length - this._srcLength
        : this._srcLength;
    }

    get tag() {
        return this.elements[0].tagName.toLowerCase();
    }

    get isHTMLTools() {
        return true;
    }

    ready() {
        return new Promise((resolve, reject) => {

            let list = this.select("img, link, script, iframe");
                list = list.join(this.elements).elements;
                list._countReady = 0;

            const checkout = () => {
                list._countReady++;
                if (list._countReady == list.length) {
                    resolve();
                }
            }

            list.forEach( element => {

                const tag = element.tagName.toLowerCase();
                const errorText = `Can't load resource "${element.src}"`;

                let complete = true;

                if (tag == "img") {
                    complete = element.complete;
                    if (complete && !element.width && !element.height) {
                        reject(errorText);
                        return;
                    }
                }

                else if (tag == "link" || tag == "iframe") {
                    complete = false;
                }

                if (complete) {
                    checkout();

                } else {
                    element.addEventListener("load", checkout);
                    element.addEventListener("error", reject);
                }
            });
        })
    }

    mutation(fn, options, replace) {

        if (!("MutationObserver" in window)) {
            printErr("Your browser not support observ mutation");
            return;
        }

        if (replace) this.mutationClear();

        this._mutations = [];

        for (let i = 0; i < this.elements.length; i++) {

            let observer = new MutationObserver((data) => fn(data[0]));
            observer.observe(this.elements[i], options);

            this._mutations.push({
                options,
                observer,
                element: this.elements[i]
            });
        }

        return this;
    }

    mutationStart() {
        for (let i = 0; i < this._mutations.length; i++) {
            let mutation = this._mutations[i];
            mutation.observer.observe(mutation.element, mutation.options);
        }
    }

    mutationEnd() {
        for (let i = 0; i < this._mutations.length; i++) {
            this._mutations[i].observer.disconnect();
        }
    }

    mutationClear() {
        for (let i = 0; i < this._mutations.length; i++) {
            this._mutations[i].observer.disconnect();
        }

        this._mutations = null;
    }

    visible(maxDepth = 3) {
        const found = this._findHidden(this.elements[0], maxDepth, 0)
        return found ? { element : found } : {}
    }

    _findHidden(element, maxDepth, depth) {
        if (depth >= maxDepth) return false;

        let result = false;
        let parent = element.parentElement || element.parentNode || null;

        if (parent && parent !== document) {
            result = this.display(parent) ? this._findHidden(parent, maxDepth, ++depth) : parent;
        }

        return result;
    }

    display(element) {
        if (!element) element = this.elements[0];

        const display = element.style.display
        ? element.style.display
        : getComputedStyle(element).display;

        return display !== "none";
    }

    select(query) {
        let elements = [], result;

        if (this.elements.length == 1) {
            elements = this.elements[0].querySelectorAll(query);
        } else {
            for (let i = 0; i < this.elements.length; i++) {
                let search = this.elements[i].querySelectorAll(query),
                    index = elements.length;

                for (let j = 0; j < search.length; j++) {
                    elements[index + j] = search[j];
                }
            }
        }

        result = new HTMLTools(elements);
        result.query = query;

        return result;
    }

    before(htl) {
        this._insert(htl, "beforebegin");
        return this;
    }

    after(htl) {
        this._insert(htl, "afterend");
        return this;
    }

    append(htl) {
        this._insert(htl, "beforeend");
        return this;
    }

    appendTo(target) {
        target.append(this);
        return this;
    }

    prepend(htl) {
        this._insert(htl, remove, "afterbegin");
        return this;
    }

    _insert(htl, position) {
        if (htl.isHTMLTools) {

            if (htl._jsonConv) {
                this._insertJSON(htl, "beforeend");
                return;
            }

            if (!Array.isArray(htl.elements)) {
                htl.elements = Array.from(htl.elements);
            }

            for (let i = 0; i < this.elements.length; i++) {
                for (let j = 0; j < htl._srcLength; j++) {
                    let element = htl.elements[j];
                    this.elements[i].insertAdjacentElement(position, element);
                }
            }

        } else if (Array.isArray(htl)) {
            for (let i = 0; i < htl.length; i++) {
                this._insert(htl[i], position);
            }
        }
    }

    _insertJSON(htl, position) {
        for (let i = 0; i < this.elements.length; i++) {
            let element = htl._jsonConv.build();
            htl.elements.push(element);
            this.elements[i].insertAdjacentElement(position, element);
        }
    }

    createFromJSON(json) {
        let jsonConv = new JSONConverter(json),
            result = jsonConv.htl;
            result._jsonConv = jsonConv;
            result.node = jsonConv.nodes;

        return result;
    }

    createJSON(htl) {
        let elements = htl ? htl.elements : this.elements,
            result;

        if (elements.length > 1) {
            result = [];
            elements.forEach((elem) => result.push(JSONConverter.createJSON(elem)));
        } else {
            result = JSONConverter.createJSON(elements[0]);
        }

        return result;
    }

    tplAppend(tpl) {
        return tpl.isTemplate ? tpl.appendTo(this) : false;
    }

    addClass(name) {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.add(name);
        }

        return this;
    }

    removeClass(name) {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.remove(name);
        }

        return this;
    }

    html(str, clear = true) {
        if (str !== undefined) {
            for (let i = 0; i < this.elements.length; i++) {
                if (clear) this.elements[i].innerHTML = str;
                else this.elements[i].innerHTML += str;
            }

        } else {
            return this.elements[0].innerHTML;
        }

        return this;
    }

    text(str) {
        if (str !== undefined) {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].innerText = str;
            }

        } else {
            return this.elements[0].innerText;
        }

        return this;
    }

    value(data) {
        if (data !== undefined) {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].value = data;
            }

        } else {
            return this.elements[0].value;
        }

        return this;
    }

    active(enable) {
        enable ? this.addClass('active') : this.removeClass('active');
        return this;
    }

    checked(enable) {
        if (typeof enable == 'boolean') {
            for (let i = 0; i < this.elements.length; i++) {
                if ('checked' in this.elements[i]) {
                    this.elements[i].checked = enable;
                }
            }
        }
        else if (enable === undefined) {
            return this.elements[0].checked;
        }

        return this;
    }

    toogle() {
        for (let i = 0; i < this.elements.length; i++) {
            if ("checked" in this.elements[i]) {
                this.elements[i].checked = !this.elements[i].checked;
            }
        }

        return this;
    }

    get index() {
        return this.elements[0].selectedIndex;
    }

    choose(index) {
        for (let i = 0; i < this.elements.length; i++) {
            if ("selectedIndex" in this.elements[i]) {
                this.elements[i].selectedIndex = index;
            }
        }

        return this;
    }

    width(value) {
        if (value === undefined) {
            return this.elements[0].offsetWidth;
        }

        if (typeof value == "number") {
            value += "px";
        }

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.width = value;
        }

        return this;
    }

    height(value) {
        if (value === undefined) {
            return this.elements[0].offsetHeight;
        }

        if (typeof value == "number") {
            value += "px";
        }

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.height = value;
        }

        return this;
    }

    offsetParent() {
        const element = this.elements[0];
        return {
            top  : element.offsetTop,
            left : element.offsetLeft
        }
    }

    offsetWindow() {
        return this.elements[0].getBoundingClientRect();
    }

    offsetScroll() {
        const element = this.elements[0];
        return {
            top  : element.scrollTop,
            left : element.scrollLeft
        }
    }

    offsetPage() {
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

    scroll() {

    }

    wrap(classList, revOrder) {
        if (typeof classList == "string") {
            let result = [],
                wrapper = document.createElement("div");
                wrapper.classList.add(classList);

            for (let i = 0; i < this.elements.length; i++) {
                let element = this.elements[i],
                    wrapClone = wrapper.cloneNode();

                element.parentNode.insertBefore(wrapClone, element);
                wrapClone.appendChild(element);

                result.push(wrapClone);
            }

            return new HTMLTools(result);

        }

        else if (Array.isArray(classList)) {
            let result;

            if (!revOrder) {
                result = this.wrap(classList[0]);
                for (let i = 1; i < classList.length; i++) {
                    this.wrap(classList[i]);
                }

            } else {
                result = this.wrap(classList[classList.length - 1]);
                for (let i = classList.length - 2; i >= 0; i--) {
                    this.wrap(classList[i]);
                }
            }

            return result;
        }
    }

    hide() {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = "none";
        }

        return this;
    }

    show(disp = "") {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = disp;
        }

        return this;
    }

    parent() {
        const parents = [];

        for (let i = 0; i < this.elements.length; i++) {
            let parent = this.elements[i].parentElement || this.elements[i].parentNode || null;
            parents.push(parent);
        }

        return new HTMLTools(parents);
    }

    transform(actions, settings) {
        CSSTransformer.apply(this, actions, settings);
        return this;
    }

    scale(value, save) {
        CSSTransformer.scale(this.elements, value, save);
        return this;
	}

	scaleX(value, save) {
        CSSTransformer.scaleX(this.elements, value, save);
        return this;
	}

	scaleY(value, save) {
        CSSTransformer.scaleY(this.elements, value, save);
        return this;
	}

	skew(value, save, units) {
        CSSTransformer.skew(this.elements, value, save, units);
        return this;
	}

	rotate(value, save, units) {
        CSSTransformer.rotate(this.elements, value, save, units);
        return this;
	}

	translate(value, save, units) {
        CSSTransformer.translate(this.elements, value, save, units);
        return this;
    }

    origin(value, units) {
        CSSTransformer.origin(this, value, units);
        return this;
    }

    getAttr(name) {
        const element = this.elements[0];
        let result;

        if (!element) {
            printErr(`Can't get attribute of undefined element`);
            return;
        }

        if (element.nodeType == 1 && element.attributes.length) {
            result = {};

            if (typeof name == "string") {
                result = element.getAttribute(name);
            }
            else if (Array.isArray(name)) {
                for (let i = 0; i < name.length; i++) {
                    let attr = element.getAttribute(item);
                    if (attr) result[item] = attr;
                }
            }
            else if (!name) {
                for (let i = 0; i < element.attributes.length; i++) {
                    let attr = element.attributes[i];
                    result[attr.name] = attr.value;
                }
            }
        }

        return result;
    }

    setAttr(attr, value) {
        if (typeof attr == "string" && value !== undefined) {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].setAttribute(attr, value)
            }
        }
        else if (typeof attr == "object") {
            for (let i = 0; i < this.elements.length; i++) {
                for (let n in attr) {
                    this.elements[i].setAttribute(n, attr[n])
                }
            }
        }

        return this;
    }

    unsetAttr(name) {
        if (typeof name == "string") {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].removeAttribute(name)
            }
        }
        else if (Array.isArray(name)) {
            for (let i = 0; i < this.elements.length; i++) {
                for (let j = 0; j < name.length; j++) {
                    this.elements[i].removeAttribute(name[j])
                }
            }
        }
        else if (name === undefined) {
            let list = this.getAttr();
            if (list) {
                for (let i = 0; i < this.elements.length; i++) {
                    for (let item in list) {
                        this.elements[i].removeAttribute(item)
                    }
                }
            }
        }

        return this;
    }

    style(name, value) {
        if (value === undefined) {
            return this.elements[0].style[name];
        }

        else if (typeof name == 'string') {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].style[name] = value;
            }
        }

        return this;
    }

    styles(list) {
        for (let i = 0; i < this.elements.length; i++) {
            for (let item in list) {
                this.elements[i].style[item] = list[item];
            }
        }

        return this;
    }

    eventAttach(data, handler) {

        if (!eventList[this._id]) {
            eventList[this._id] = {};
        }

        let list = eventList[this._id];

        if (typeof data == 'string' && typeof handler == 'function') {
            this._eventAttach(list, data, handler);
        }

        else if (typeof data == 'object') {
            for (let event in data) {
                this._eventAttach(list, event, data[event]);
            }
        }

        return this;
    }

    eventDispatch(type) {
        const event = new Event(type);

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].dispatchEvent(event)
        }

        return this;
    }

    eventDetach(type) {
        const list = eventList[this._id];

        if (type) {
            for (let event in list) {
                this.elements.unsetAttr(event.substr(0, 2));
            }

        } else {
            eventList[this._id][type] = undefined;
        }

        return this;
    }

    _eventAttach(list, type, handler) {
        if (list[type]) {
            list[type].push(handler);
        } else {
            list[type] = new CallBacker(handler);
        }

        this.setAttr('on' + type, `$html._eventStart(${this._id},'${type}',event)`);
    }

    each(handler) {
        for (let i = 0; i < this.elements.length; i++) {
            handler(this.elements[i], i, this);
        }

        return this;
    }

    clone(deep) {
        const clones = [];

        for (let i = 0; i < this.elements.length; i++) {
            clones.push(this.elements[i].cloneNode(deep))
        }

        return new HTMLTools(clones);
    }

    join(source) {
        let elemList;

        if (!source) {
            printErr(`Can't attach the invalid elements (${source})`);
            return;
        }

        this.elements = Array.from(this.elements);

        if (source.isHTMLTools) {
            elemList = source.elements;
        } else if (source instanceof NodeList || Array.isArray(source)) {
            elemList = source;
        } else {
            elemList = [source];
        }

        for (let i = 0; i < elemList.length; i++) {
            this.elements.push(elemList[i]);
        }

        return this;
    }

    clear() {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].innerHTML = '';
        }

        return this;
    }

    remove() {
        for (let i = 0; i < this.elements.length; i++) {
            let element = this.elements[i];

            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }

        this.elements = [];
        this._srcLength = 0;

        return this;
    }
}