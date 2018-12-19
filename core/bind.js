import {define} from './object';

const bind = {
	change(object, field, trigger) {
		const binded = `__bind__${field}`;

		define(object, binded, { value: object[field] });

		define(object, field, {
			get: () => object[binded],
			set: (value) => {
				object[binded] = value;
				trigger(value);
			},
			config: true,
			enumer: true
		});
	},

	context(fn, context) {
		return function(){
			return fn.apply(context, arguments);
		}
	},

	fields(settings) {
		const { left, right, modifier, trigger } = settings;

		switch (data.type) {
			case "left"  : this._attach(left, right, modifier, trigger); break;
			case "right" : this._attach(right, left, modifier, trigger); break;
			case "cross" :
				this._attach(left, right, right.modifier, left.trigger);
				this._attach(right, left, left.modifier, right.trigger);
				break;
		}
	},

	_attach(current, target, modifier, trigger) {
		this._genAccessors(current.object, current.field, trigger);
		this._addJoint(
			current.object,
			current.field, {
				object  : target.object,
				field   : target.field,
				modifier: modifier
			}
		);
	},

	_genAccessors(object, field, trigger) {
		const self = this;
		const binded = `__bind__${field}`;

		if (!(binded in object)) {
			object[binded] = {
				joints : [],
				value  : object[field],
				trigger: trigger
			}

			define(object, field, {
				get: () => object[binded].value,
				set: (value) => { self._setData(object, field, value) },
				config: true,
				enumer: true
			});
		}
	},

	_addJoint(object, field, joint) {
		const binded = `__bind__${field}`;
		object[binded].joints.push(joint);
		this._applyValue(joint.object, joint.field, object[binded].value, joint.modifier);
	},

	_removeJoint() {

	},

	_applyValue(object, field, value, modifier) {
		const binded = `__bind__${field}`;

		if (modifier) value = modifier(value);

		if (binded in object) {
			object[binded].value = value
		} else {
			object[field] = value;
		}
	},

	_setData(object, field, data) {
		const sourseValue = data.value || data;
		const binded = object[`__bind__${field}`];
		binded.value = sourseValue;

		if (!data.value && binded.trigger) {
			binded.trigger(sourseValue, field);
		}

		binded.joints.forEach((joint) => {

			const value = joint.modifier ? joint.modifier(sourseValue) : sourseValue;

			if (joint.object === data.object && joint.field === data.field) {
				return;

			} else if (('_bind_' + joint.field) in joint.object) {
				joint.object[joint.field] = { value, object, field };

			} else {
				joint.object[joint.field] = value;
			}
		});
	}
}

export default bind;