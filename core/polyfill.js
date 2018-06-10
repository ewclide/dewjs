if (!("assign" in Object))
	Object.defineProperty( Object, "assign", {

		enumerable : false,
		configurable : true,
		writable : true,

		value : function(target /*, ...sources */)
		{
			if (target === undefined || target === null)
				throw new TypeError('Object.assign: cannot convert undefined or null to object');

			for (var arg = 1; arg < arguments.length; arg++)
			{
				var source = arguments[arg];

				if (source === undefined || source === null) continue;
				else source = Object(source);

				for (var key in source)
					target[key] = source[key];
			}

			return target;
		}
	});

if (!("from" in Array))
	Object.defineProperty( Array, "from", {
		
		enumerable : false,
		configurable : true,
		writable : true,

		value : (function(){

			function getLength(obj)
			{
				var length = 0;

				if ("length" in obj)
				{
					length = parseInt(obj.length, 10);
					if (isNaN(length) || length < 0) length = 0;
				}
				
				return length; 
			}

			function getValue(mapFn, target, key)
			{
				if (mapFn)
				{
					if (thisArg !== undefined) return mapFn.call(thisArg, target[key], key);
					else return mapFn(target[key], key);
				}
				else return target[key];
			}

			return function(target /*, mapFn, thisArg */)
			{
				if (target === null || target === undefined)
					throw new TypeError("Array.from: cannot convert first argument to object");

				target = Object(target);

				var result = [],
					length = getLength(target),
					mapFn = arguments[1],
					thisArg = arguments[2];

			    if (!Array.isArray(target))
			    	for (var key = 0; key < length; key++)
			    	{
			    		var desc = Object.getOwnPropertyDescriptor(target, key);

				       	if (desc !== undefined && desc.enumerable)
				       		result.push(getValue(mapFn, target, key));

				       	else result.push(undefined);
			    	}

			    else result = target;

				return result;
			};

		})()
	});




