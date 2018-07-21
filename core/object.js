import {InitObject} from './init-object';
import {printErr} from './functions';

function join(list, target, method)
{
    Array.isArray(list)
    ? list.forEach( item => method(item, target) )
    : method(list, target)
}

function defineProperties(from, to)
{
    for (var i in from)
    {
        var desc = Object.getOwnPropertyDescriptor(from, i);
        desc ? Object.defineProperty(to, i, desc) : to[i] = from[i];
    }

    return to;
}

function clone(object, full)
{
    function Copy()
    {
        for (var field in object)
        {
            if (object.hasOwnProperty(field))
                this[field] = full ? clone(object[field], true) : object[field];
        }
    }

    if (Array.isArray(object))
        return object.slice();

    else if (typeof object == "object")
    {
        if ("__proto__" in object)
            Copy.prototype = object.__proto__;

        return new Copy();
    }

    else return object;
}

class Methods
{
    constructor(target)
    {
        this.target = target;
    }

    clone(full)
    {
        return this.target.constructor != Object
        ? Object.assign((new this.target.constructor()), this.target)
        : clone(this.target, full)
    }

    joinLeft(list, copy)
    {
        var target = copy ? Object.assign({}, this.target) : this.target;

        join(list, target, (item, target) => {
            for (var i in item)
                i in target && (target[i] = item[i]);
        });

        return target;
    }

    joinRight(list, copy)
    {
        var target = copy ? Object.assign({}, this.target) : this.target;

        join(list, target, (item, target) => {
            for (var i in item)
                !(i in target) && (target[i] = item[i]);
        });

        return target;
    }

    joinFull(list, copy)
    {
        var target = copy ? defineProperties(this.target, {}) : this.target;
        join(list, target, item => defineProperties(item, target));
        return target;
    }

    init(values, settings, common = { errors : true })
    {
        if (!values || !settings)
        {
            printErr("Dew object.init error: missing required arguments (values or settings)");
            return false;
        }

        var init = new InitObject(this.target);

        for (var field in settings)
        {
            if (typeof settings[field] !== "object")
            {
                common.def = settings[field];
                init.checkout(field, common, values[field]);
            }
            else init.checkout(field, settings[field], values[field]);
        }

        return init.errors.length
        ? (common.errors && printErr(init.errors), false) : true;
    }
}

export function object(obj)
{
    return new Methods(obj);
}