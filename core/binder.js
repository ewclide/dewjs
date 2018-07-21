import {define} from './functions';

class Binder
{
	constructor(){}

	change(object, field, trigger)
	{
		var hidden = "_bind_" + field;
		// object[hidden] = object[field];

		define(object, hidden, { value : object[field] });

		define(object, field, {
			get : function()
			{
				return object[hidden];
			},
			set : function(value)
			{
				object[hidden] = value;
				trigger(value);
			},
			config : true,
			enumer : true
		});
	}

	context(fn, context)
	{
		return function(){
			return fn.apply(context, arguments);
		}
	}

	fields(data)
	{
		var left = data.left,
			right = data.right,
			modifier = data.modifier,
			trigger = data.trigger;

		switch (data.type)
		{
			case "left"  : this._attach(left, right, modifier, trigger); break;
			case "right" : this._attach(right, left, modifier, trigger); break;
			case "cross" :
				this._attach(left, right, right.modifier, left.trigger);
				this._attach(right, left, left.modifier, right.trigger);
				break;
		}
	}

	unset()
	{

	}

	_attach(current, target, modifier, trigger)
	{
		this._genGetSet(current.object, current.field, trigger);

		this._addJoint(
			current.object,
			current.field,
			{
				object   : target.object,
				field    : target.field,
				modifier : modifier
			}
		);
	}

	_genGetSet(object, field, trigger)
	{
		var self = this,
			binded = "_bind_" + field;

		if (!(binded in object))
		{
			object[binded] = {
				joints  : [],
				value   : object[field],
				trigger : trigger
			}

			define(object, field, {
				get : function(){
					return object[binded].value;
				},
				set : function(value){
					self._setData(object, field, value);
				},
				config : true,
				enumer : true
			});
		}
	}

	_addJoint(object, field, joint)
	{
		object["_bind_" + field].joints.push(joint);
		this._applyValue(joint.object, joint.field, object["_bind_" + field].value, joint.modifier);
	}

	_removeJoint()
	{

	}

	_applyValue(object, field, value, modifier)
	{
		var binded = "_bind_" + field;

		if (modifier) value = modifier(value);

		binded in object
		? object[binded].value = value
		: object[field] = value;
	}

	_setData(object, field, data)
	{
		var sourseValue = data.value || data,
			binded = object["_bind_" + field];
			binded.value = sourseValue;

		if (!data.value && binded.trigger)
			binded.trigger(sourseValue, field);

		binded.joints.forEach(function(joint){

			var value = joint.modifier ? joint.modifier(sourseValue) : sourseValue;

			if (joint.object == data.object && joint.field == data.field) return;

			else if (("_bind_" + joint.field) in joint.object)
				joint.object[joint.field] = {
					value : value,
					object : object,
					field : field
				};
				
			else joint.object[joint.field] = value;

		});
	}
}

var bind = new Binder();

export {bind}