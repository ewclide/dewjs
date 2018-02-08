import {Init} from './init';

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
        return object.$copy();

    else if (typeof object == "object")
    {
        if ("__proto__" in object)
            Copy.prototype = object.__proto__;

        return new Copy();
    }

    else return object;
}

Object.prototype.$define({
    $clone : function(full)
    {
        if (this.constructor != Object)
        {
            var result = new this.constructor();
            return Object.assign(result, this);
        }
        else return clone(this, full);
    },
    $init : function(fields, data, showErrors = true)
    {
        var init = new Init(this);
        init.start(fields, data);

        if (showErrors) init.showErrors();
    }
});

function join(objects, method)
{
    if (Array.isArray(objects))
        objects.forEach(function(object){
            method(object);
        });

    else method(objects);
}

Object.prototype.$define("$join", {
    get : function()
    {
        var self = this;

        return {
            left : function(objects)
            {
                join(objects, function(object){
                    for (var i in object)
                        i in self && (self[i] = object[i]);
                }); 
            },
            right : function(objects)
            {
                join(objects, function(object){
                    for (var i in object)
                        !(i in self) && (self[i] = object[i]);
                }); 
            },
            full : function(objects)
            {
                join(objects, function(object){
                    for (var i in object)
                        self[i] = object[i];
                });
            }
        }
    },
    set : function(){}
});