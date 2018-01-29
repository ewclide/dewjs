import {Init} from './init';

Object.prototype.$define({
    $join : function(objects)
    {
        var self = this;

        if (Array.isArray(objects))
            objects.forEach(function(object){
                Object.assign(self, object);
            });

        else Object.assign(self, objects);
    },
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


function clone(object, full)
{
   function Clone(field)
   {
        for (field in object)
        {
            if (object.hasOwnProperty(field))
                this[field] = ( full && typeof object[field] == "object" ) ? clone(object[field], true) : object[field];
        }
   }

   if ("__proto__" in object) Clone.prototype = object.__proto__;

   return new Clone();
}