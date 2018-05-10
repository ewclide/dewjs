import {InitObject} from './init-object';
import {printErrors} from './functions';
import {array} from './array';

function join(list, method)
{
    Array.isArray(list)
    ? list.forEach( item => method(item) )
    : method(list)
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
        return array(object).copy();

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

    joinLeft(list)
    {
        join(list, item => {
            for (var i in item)
                i in this.target && (this.target[i] = item[i]);
        })
        
        return this;
    }

    joinRight(list)
    {
        join(list, item => {
            for (var i in item)
                !(i in this.target) && (this.target[i] = item[i]);
        });

        return this;
    }

    joinFull(list)
    {
        join(list,  item => {
            for (var i in item)
                this.target[i] = item[i];
        });

        return this;
    }

    init(values, settings, common = {})
    {
        if (!values || !settings)
        {
            printErrors("Dew object.init error: missing required arguments (values or settings)");
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
        ? (common.errors && printErrors(init.errors), false) : true;
    }
}

export function object(obj)
{
    return new Methods(obj);
}