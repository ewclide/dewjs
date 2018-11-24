import {printErr} from './functions';
import ObjectIniter from './object-initer';

function _join(list, target, method)
{
    Array.isArray(list)
    ? list.forEach( item => method(item, target) )
    : method(list, target)
}

function _defineProperties(from, target)
{
    for (let i in from)
    {
        let desc = Object.getOwnPropertyDescriptor(from, i);
        desc ? Object.defineProperty(target, i, desc) : target[i] = from[i];
    }

    return target;
}

function _createClone(object, full)
{
    function Clone()
    {
        for (let field in object)
        {
            if (object.hasOwnProperty(field))
                this[field] = full ? _createClone(object[field], true) : object[field];
        }
    }

    if (Array.isArray(object))
        return object.slice();

    else if (typeof object == "object")
    {
        Clone.prototype = "__proto__" in object
        ? object.__proto__ : Object.getPrototypeOf(object);
        
        Clone.constructor = object.constructor;

        return new Clone();
    }

    else return object;
}

export function fastClone()
{

}

export function clone(target, full)
{
    return target.constructor != Object
    ? Object.assign((new target.constructor()), target)
    : _createClone(target, full)
}

export function joinLeft(target, list, copy)
{
    target = copy ? Object.assign({}, target) : target;

    _join(list, target, (item, target) => {
        for (let i in item)
            i in target && (target[i] = item[i]);
    });

    return target;
}

export function joinRight(target, list, copy)
{
    target = copy ? Object.assign({}, target) : target;

    _join(list, target, (item, target) => {
        for (let i in item)
            !(i in target) && (target[i] = item[i]);
    });

    return target;
}

export function joinFull(target, list, copy)
{
    target = copy ? _defineProperties(target, {}) : target;
    _join(list, target, item => _defineProperties(item, target));
    return target;
}

export function init(target, values, settings, common = { errors : true })
{
    if (!values || !settings)
    {
        printErr("DEW object.init error - missing required arguments (values or settings)");
        return false;
    }

    let initer = new ObjectIniter(target);

    for (let field in settings)
    {
        if (typeof settings[field] !== "object")
        {
            common.def = settings[field];
            initer.checkout(field, common, values[field]);
        }
        else initer.checkout(field, settings[field], values[field]);
    }

    return initer.errors.length
    ? (common.errors && printErr(initer.errors), false) : true;
}