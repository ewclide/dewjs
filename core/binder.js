export class Binder
{
	constructor(){}

	change(object, field, trigger)
	{
		var hidden = "_" + field;
		// object[hidden] = object[field];

		object.$define(hidden, { value : object[field] });

		object.$define(field, {
			get : function()
			{
				return object[hidden];
			},
			set : function(value)
			{
				object[hidden] = value;
				trigger(value);
			},
			conf : true,
			enumer : true
		});
	}

	context(fn, context)
	{
		return function(){
			return fn.apply(context, arguments);
		};
	}

	fields(data)
	{
		var left = data.left,
		right = data.right,
		modifier = data.modifier,
		trigger = data.trigger;

		switch (data.type)
		{
			case "left" : this._attach(left, right, modifier, trigger); break;
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
			current.object, current.field,
			{
				object : target.object,
				field : target.field,
				modifier : modifier
			}
		);
	}

	_genGetSet(object, field, trigger)
	{
		var self = this,
		hidden = "_" + field;

		if (!(hidden in object))
		{
			object[hidden] = {
				joints : [],
				value : object[field],
				trigger : trigger
			}

			object.$define( field, {
				get : function(){
					return object[hidden].value;
				},
				set : function(value){
					self._setData(object, field, value);
				},
				conf : true,
				enumer : true
			});
		}
	}

	_addJoint(object, field, joint)
	{
		object["_" + field].joints.push(joint);
		this._applyValue(joint.object, joint.field, object["_" + field].value, joint.modifier);
	}

	_removeJoint()
	{

	}

	_applyValue(object, field, value, modifier)
	{
		var hidden = "_" + field;

		if (modifier) value = modifier(value);

		if (hidden in object) object[hidden].value = value;
		else object[field] = value;
	}

	_setData(object, field, data)
	{
		var sourseValue = data.value || data,
			binded = object["_" + field];
			binded.value = sourseValue;

		if (!data.value && binded.trigger)
			binded.trigger(sourseValue, field);

		binded.joints.forEach(function(joint){

			var value = joint.modifier ? joint.modifier(sourseValue) : sourseValue;

			if (joint.object == data.object && joint.field == data.field) return;

			else if (("_" + joint.field) in joint.object)
				joint.object[joint.field] = {
					value : value,
					object : object,
					field : field
				};
				
			else joint.object[joint.field] = value;

		});
	}
}