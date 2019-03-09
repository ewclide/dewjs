import { printErr, idGetter } from './functions';
import JSONConverter from './json-converter';
import CSSTransformer from './css-transformer';
import CallBacker from './callbacker';

export const getIdOfElement = idGetter('__elem__');
export const eventList = new Map();

export class HTMLTools
{
    constructor(source) {
        if (source) {
            this.elements = source instanceof NodeList || Array.isArray(source)
                ? source : [source];
        } else {
            this.elements = [];
        }

        this._srcLength = this.elements.length;
        this._ready = false;
        this._id = getIdOfElement();

        this.query = '';
    }

    native() {
        return this.elements.length == 1
            ? this.elements[0] : Array.from(this.elements);
    }

    get length() {
        return this.elements.length;
    }

    get tag() {
        return this.elements[0].tagName.toLowerCase();
    }

    get isHTMLTools() {
        return true;
    }

    ready() {
        return new Promise((resolve, reject) => {

            const elems = this.select('img, link, script, iframe');
            const list = elems.join(this.elements).elements;
            list._countReady = 0;

            const checkout = () => {
                list._countReady++;
                if (list._countReady == list.length) {
                    resolve();
                }
            }

            list.forEach((element) => {

                const tag = element.tagName.toLowerCase();
                const errorText = `Can't load resource "${element.src}"`;
                let complete = true;

                if (tag === 'img') {
                    complete = element.complete;
                    if (complete && !element.width && !element.height) {
                        reject(errorText);
                        return;
                    }

                } else if (tag === 'link' || tag === 'iframe') {
                    complete = false;
                }

                if (complete) {
                    checkout();

                } else {
                    element.addEventListener('load', checkout);
                    element.addEventListener('error', reject);
                }
            });
        })
    }

    mutation(fn, options, replace) {

        if (!('MutationObserver' in window)) {
            printErr('Your browser not support observ mutation');
            return;
        }

        if (replace) this.mutationClear();

        this._mutations = [];

        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            const observer = new MutationObserver((data) => fn(data[0]));
            observer.observe(element, options);

            this._mutations.push({
                options,
                observer,
                element
            });
        }

        return this;
    }

    mutationStart() {
        this._mutations.forEach((mutation) => {
            const { observer, element, options } = mutation;
            observer.observe(element, options);
        });
    }

    mutationEnd() {
        this._mutations.forEach((mutation) => {
            mutation.observer.disconnect();
        });
    }

    mutationClear() {
        this._mutations.forEach((mutation) => {
            mutation.observer.disconnect();
        });

        this._mutations = null;
    }

    visible(maxDepth = 3) {
        const element = this._searchHidden(this.elements[0], maxDepth, 0)
        return element ? { element } : {}
    }

    _searchHidden(element, maxDepth, depth) {
        if (depth >= maxDepth) return false;

        const { parentElement, parentNode } = element;
        const parent = parentElement || parentNode;

        if (parent && parent !== document) {
            return this.display(parent)
                ? this._searchHidden(parent, maxDepth, ++depth)
                : parent;
        }

        return false;
    }

    display(element) {
        const elem = element || this.elements[0];

        const display = elem.style.display
            ? elem.style.display
            : getComputedStyle(elem).display;

        return display !== 'none';
    }

    inScreen(element) {
        const elem = element || this.elements[0];
        const { top, left, bottom, right } = elem.getBoundingClientRect();
        const { clientWidth, clientHeight } = document.documentElement;

        if (bottom < 0 || right < 0 ||
            top > clientHeight || left > clientWidth) {
                return false;
            }
        return true;
    }

    select(query) {
        if (this.elements.length == 1) {
            const element = this.elements[0].querySelectorAll(query);
            const htl = new HTMLTools(element);
            htl.query = query;

            return htl;
        }

        const result = [];

        for (let i = 0; i < this.elements.length; i++) {
            const search = this.elements[i].querySelectorAll(query);
            const index = result.length;

            for (let j = 0; j < search.length; j++) {
                result[index + j] = search[j];
            }
        }

        const htl = new HTMLTools(result);
        htl.query = query;

        return htl;
    }

    getById(id) {
        const htl = new HTMLTools(document.getElementById(id));
        htl.query = '#' + id;

        return htl;
    }

    before(htl) {
        this._insert(htl, 'beforebegin');
        return this;
    }

    after(htl) {
        this._insert(htl, 'afterend');
        return this;
    }

    append(htl) {
        this._insert(htl, 'beforeend');
        return this;
    }

    appendTo(target) {
        target.append(this);
        return this;
    }

    prepend(htl) {
        this._insert(htl, 'afterbegin');
        return this;
    }

    prependTo(target) {
        target.prepend(this);
        return this;
    }

    _insert(htl, position) {
        if (htl.isHTMLTools) {

            if (htl._jsonConv) {
                this._insertJSON(htl, 'beforeend');
                return;
            }

            if (!Array.isArray(htl.elements)) {
                htl.elements = Array.from(htl.elements);
            }

            let index = 0;
            if (!htl.elements[0].parentNode) {
                const [ firstElem ] = this.elements;
                for (let i = 0; i < htl._srcLength; i++) {
                    firstElem.insertAdjacentElement(position, htl.elements[i])
                }
                index++;
            }

            for (let i = index; i < this.elements.length; i++) {
                for (let j = 0; j < htl._srcLength; j++) {
                    const elemClone = htl.elements[j].cloneNode(true);
                    htl.elements.push(elemClone);
                    this.elements[i].insertAdjacentElement(position, elemClone);
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
            const element = htl._jsonConv.build();
            htl.elements.push(element);
            this.elements[i].insertAdjacentElement(position, element);
        }
    }

    move(htl, position = 'end', child = 0, reverse = false) {
        let pos;
        switch (position) {
            case 'before': pos = 'beforebegin'; break;
            case 'begin' : pos = 'afterbegin'; break;
            case 'end'   : pos = 'beforeend'; break;
            case 'after' : pos = 'afterend'; break;
        }

        const last = this.elements.length - 1;
        const place = this.elements[reverse ? last - child : child];

        const { elements } = htl;
        for (let i = 0; i < elements.length; i++) {
            place.insertAdjacentElement(pos, elements[i]);
        }

        return this;
    }

    moveTo(target, position, child, reverse) {
        target.move(this, position, child, reverse);
        return this;
    }

    createFromJSON(json) {
        const jsonConv = new JSONConverter(json);
        const { htl, nodes } = jsonConv;

        htl.node = nodes;
        htl._jsonConv = jsonConv;

        return htl;
    }

    createJSON(htl) {
        const elements = htl ? htl.elements : this.elements

        if (elements.length > 1) {
            return elements.map((elem) => JSONConverter.createJSON(elem));
        }

        return JSONConverter.createJSON(elements[0]);
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
        if (str === undefined) {
            return this.elements[0].innerHTML;
        }

        for (let i = 0; i < this.elements.length; i++) {
            if (clear) {
                this.elements[i].innerHTML = str;
            } else {
                this.elements[i].innerHTML += str;
            }
        }

        return this;
    }

    text(str) {
        if (str === undefined) {
            return this.elements[0].innerText;
        }

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].innerText = str;
        }

        return this;
    }

    value(data) {
        if (data === undefined) {
            return this.elements[0].value;
        }

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].value = data;
        }

        return this;
    }

    active(enable) {
        enable ? this.addClass('active') : this.removeClass('active');
        return this;
    }

    checked(enable) {
        if (enable === undefined) {
            return this.elements[0].checked;
        }

        const checked = Boolean(enable);
        for (let i = 0; i < this.elements.length; i++) {
            if ('checked' in this.elements[i]) {
                this.elements[i].checked = checked;
            }
        }

        return this;
    }

    toogle() {
        for (let i = 0; i < this.elements.length; i++) {
            if ('checked' in this.elements[i]) {
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
            if ('selectedIndex' in this.elements[i]) {
                this.elements[i].selectedIndex = index;
            }
        }

        return this;
    }

    width(value) {
        if (value === undefined) {
            return this.elements[0].offsetWidth;
        }

        let val = value;
        if (typeof value == 'number') val += 'px';

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.width = val;
        }

        return this;
    }

    height(value) {
        if (value === undefined) {
            return this.elements[0].offsetHeight;
        }

        let val = value;
        if (typeof value == 'number') val += 'px';  

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.height = val;
        }

        return this;
    }

    size(width, height) {
        if (width === undefined && height === undefined) {
            const { offsetWidth, offsetHeight } = this.elements[0];
            return {
                width: offsetWidth,
                height: offsetHeight
            }
        }

        let w = width; h = height;
        if (typeof width == 'number') w += 'px';
        if (typeof height == 'number') h += 'px';

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.width = w;
            this.elements[i].style.height = h;
        }
    }

    offsetParent() {
        const { offsetTop, offsetLeft } = this.elements[0];
        return {
            top  : offsetTop,
            left : offsetLeft
        }
    }

    offsetWindow() {
        return this.elements[0].getBoundingClientRect();
    }

    offsetScroll() {
        const { scrollTop, scrollLeft } = this.elements[0];
        return {
            top  : scrollTop,
            left : scrollLeft
        }
    }

    offsetPage() {
        const element = this.elements[0];
        const rect = element.getBoundingClientRect();
        const doc  = document.documentElement;
        const top  = rect.top + window.pageYOffset - doc.clientTop;
        const left = rect.left + window.pageXOffset - doc.clientLeft;

        return {
            top    : Math.round(top),
            left   : Math.round(left),
            bottom : Math.round(top + element.offsetHeight),
            right  : Math.round(left + element.offsetWidth)
        }
    }

    scroll() {

    }

    wrap(classList, revOrder) {
        if (typeof classList == 'string') {
            const result = [];
            const wrapper = document.createElement('div');
            wrapper.classList.add(classList);

            for (let i = 0; i < this.elements.length; i++) {
                const element = this.elements[i];
                const wrapClone = wrapper.cloneNode();

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
            this.elements[i].style.display = 'none';
        }

        return this;
    }

    show(disp = '') {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.display = disp;
        }

        return this;
    }

    parent() {
        const parents = [];

        for (let i = 0; i < this.elements.length; i++) {
            const { parentElement, parentNode } = this.elements[i];
            const parent = parentElement || parentNode;
            if (parent) parents.push(parent);
        }

        return new HTMLTools(parents);
    }

    transform(actions, settings) {
        CSSTransformer.apply(this, actions, settings);
        return this;
    }

    matrix2d(matrix, save) {
        CSSTransformer.matrix2d(this.elements, actions, save);
        return this;
    }

    matrix3d(matrix, save) {
        CSSTransformer.matrix3d(this.elements, matrix, save);
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
        if (!element) return;

        const { attributes, nodeType } = element;
        if (nodeType !== 1 || !attributes.length) {
            return;
        }

        if (typeof name == 'string') {
            return element.getAttribute(name);
        }

        const result = {};

        if (Array.isArray(name)) {
            for (let i = 0; i < name.length; i++) {
                const attr = element.getAttribute(item);
                if (attr) result[item] = attr;
            }

        } else if (!name) {
            for (let i = 0; i < element.attributes.length; i++) {
                const { name, value } = element.attributes[i];
                result[name] = value;
            }
        }

        return result;
    }

    setAttr(attr, value) {
        if (typeof attr == 'string' && value !== undefined) {
            for (let i = 0; i < this.elements.length; i++) {
                this.elements[i].setAttribute(attr, value)
            }
        } else if (typeof attr == 'object') {
            for (let i = 0; i < this.elements.length; i++) {
                for (const name in attr) {
                    this.elements[i].setAttribute(name, attr[name])
                }
            }
        }

        return this;
    }

    unsetAttr(name) {
        if (typeof name == 'string') {
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
            const list = this.getAttr();
            if (!list) return this;
            for (let i = 0; i < this.elements.length; i++) {
                for (let item in list) {
                    this.elements[i].removeAttribute(item)
                }
            }
        }

        return this;
    }

    style(name, value) {
        if (typeof name != 'string') return this;

        if (value === undefined) {
            return this.elements[0].style[name];
        }

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style[name] = value;
        }

        return this;
    }

    styles() {
        let list, prefix = '';

        if (arguments.length == 1) {
            list = arguments[0];
        } else {
            list = arguments[1];
            prefix = arguments[0];
        }

        if (prefix) prefix += '-';

        for (let i = 0; i < this.elements.length; i++) {
            for (const item in list) {
                this.elements[i].style[prefix + item] = list[item];
            }
        }

        return this;
    }

    addEvent(data, handler) {
        if (!eventList.has(this._id)) {
            eventList.set(this._id, new Map());
        }

        const list = eventList.get(this._id);

        if (typeof data == 'string' && typeof handler == 'function') {
            this._eventAttach(list, data, handler);
        }

        else if (typeof data == 'object') {
            for (const event in data) {
                this._eventAttach(list, event, data[event]);
            }
        }

        return this;
    }

    fireEvent(type) {
        const event = new Event(type);

        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].dispatchEvent(event)
        }

        return this;
    }

    removeEvent(type) {
        if (!eventList.has(this._id)) return this;
        const events = eventList.get(this._id);

        if (!type) {
            for (const [event] of events) {
                this.unsetAttr('on' + event);
            }

            events.clear();
            return this;
        }

        events.delete(type);
        this.unsetAttr('on' + type);

        return this;
    }

    _eventAttach(events, type, handler) {
        if (events.has(type)) {
            events.get(type).push(handler);
        } else {
            events.set(type, new CallBacker(handler));
        }

        this.setAttr('on' + type, `$event.fire('${this._id}','${type}',event)`);
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
        this.elements = Array.from(this.elements);
        let elemList;

        if (source.isHTMLTools) {
            elemList = source.elements;
        } else if (source instanceof NodeList || Array.isArray(source)) {
            elemList = source;
        } else if (source instanceof Element) {
            elemList = [source];
        } else {
            printErr(`Can't attach element ${source}`);
            return this;
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
            const element = this.elements[i];
            const { parentNode } = element;
            if (parentNode) parentNode.removeChild(element);
        }

        if (!Array.isArray(this.elements)) {
            this.elements = Array.from(this.elements)
        }

        this.elements.splice(this._srcLength);

        return this;
    }

    delete() {
        for (let i = 0; i < this.elements.length; i++) {
            const element = this.elements[i];
            const { parentNode } = element;
            if (parentNode) parentNode.removeChild(element);
        }

        this.elements = [];
        this._srcLength = 0;

        return this;
    }
}