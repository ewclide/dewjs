import {define} from './object';

const getId = (() => {
	let id = 0;
	return () => id++;
})();

const bind = {
	onchange(object, field, trigger) {
		const meta = `__bind__${field}`;

		define(object, meta, { value: object[field] });

		define(object, field, {
			get: () => object[meta],
			set: (value) => {
				object[meta] = value;
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

	trigger(object, field, trigger) {
		this._genAccessors(object, field, trigger);
	},

	break(object, field, cross) {
		const meta = `__bind__${field}`;
		if (!object[meta]) return;

		const value = object[meta].value;
		const joints = object[meta].joints;

		define(object, { [field]: value, [meta]: null });

		if (cross) {
			joints.forEach((joint, id) => this._breakJoint(joint, id));
		}
	},

	_breakJoint(joint, id) {
		const meta = joint.object[`__bind__${joint.field}`];
		if (!meta) return;

		if (meta.joint.has(id)) {
			meta.joint.delete(id);
		}
	},

	clear(object, field) {
		const meta = object[`__bind__${field}`];
		if (!meta) return;

		meta.joints.clear();
		meta.trigger = null;
	},

	fields(settings) {
		const { type, left, right, modifier, trigger } = settings;

		if (type === 'sided') {
			this._attach(left, right, modifier, trigger);
		} else if (type === 'cross') {
			const id = getId();
			this._attach(left, right, left.modifier, left.trigger, id);
			this._attach(right, left, right.modifier, right.trigger, id);
		}
	},

	sided(arrCurrent, arrTarget, modifier, trigger) {
		const current = { object: arrCurrent[0], field: arrCurrent[1] }
		const target = { object: arrTarget[0], field: arrTarget[1] }
		
		this._attach(current, target, modifier, trigger);
	},

	cross(arrFirst, arrSecond) {
		const left = { object: arrFirst[0], field: arrFirst[1] };
		const right = { object: arrSecond[0], field: arrSecond[1] };
		const leftModifier = arrFirst[2];
		const rightModifier = arrSecond[2];
		const leftTrigger = arrFirst[3];
		const rightTrigger = arrSecond[3];

		const id = getId();
		this._attach(left, right, leftModifier, leftTrigger, id);
		this._attach(right, left, rightModifier, rightTrigger, id);
	},

	_attach(current, target, modifier, trigger, id = getId()) {
		this._genAccessors(current.object, current.field, trigger);
		this._addJoint(id, current.object, current.field, {
			object  : target.object,
			field   : target.field,
			modifier: modifier
		});
	},

	_genAccessors(object, field, trigger) {
		const self = this;
		const meta = `__bind__${field}`;

		if (meta in object) return;

		define(object, meta, {
			value: {
				joints : new Map(),
				value  : object[field],
				trigger: trigger
			},
			config: true
		});

		define(object, field, {
			get: () => object[meta].value,
			set: (value) => { self._setData(object, field, value) },
			config: true,
			enumer: true
		});
	},

	_addJoint(id, object, field, joint) {
		const meta = `__bind__${field}`;
		object[meta].joints.set(id, joint);
		this._applyValue(joint.object, joint.field, object[meta].value, joint.modifier);
	},

	_applyValue(object, field, value, modifier) {
		const meta = `__bind__${field}`;

		if (modifier) value = modifier(value);

		if (meta in object) {
			object[meta].value = value
		} else {
			object[field] = value;
		}
	},

	_setData(object, field, data) {
		const sourseValue = data.value || data;
		const meta = object[`__bind__${field}`];
		meta.value = sourseValue;

		if (!data.value && meta.trigger) {
			meta.trigger(sourseValue);
		}

		meta.joints.forEach((joint) => {
			const value = joint.modifier ? joint.modifier(sourseValue) : sourseValue;

			if (joint.object === data.object && joint.field === data.field) {
				return;

			} else if (('__bind__' + joint.field) in joint.object) {
				joint.object[joint.field] = { value, object, field };

			} else {
				joint.object[joint.field] = value;
			}
		});
	}
}

export default bind;