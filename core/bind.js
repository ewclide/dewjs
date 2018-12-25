import {printErr, idGetter} from './functions';
import {define} from './object';

const getId = idGetter();
const _bondings = new Map();

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

	detachById(id) {
		if (!_bondings.has(id)) return;
		const { current, target } = _bondings.get(id);

		this.detach(
			current.object, current.field,
			target.object, target.field,
		);
	},

	detach(curObject, curField, tarObject, tarField) {
		const meta = curObject[`__bind__${curField}`];
		if (!meta) return;

		meta.joints.has();
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
			return this._attach(left, right, modifier, trigger);
		} else if (type === 'cross') {
			const id = getId();
			this._attach(left, right, left.modifier, left.trigger, id);
			this._attach(right, left, right.modifier, right.trigger, id);
			return id;
		}
	},

	sided(current, target, modifier, trigger) {
		if (!Array.isArray(current) && !Array.isArray(target)) {
			printErr(`DEW bind error - "${current}" and "${target}" arguments must be an array!`);
			return;
		}

		return this._attach(
			{ object: current[0], field: current[1] },
			{ object: target[0], field: target[1] },
			modifier,
			trigger
		);
	},

	cross(current, target) {
		if (!Array.isArray(current) && !Array.isArray(target)) {
			printErr(`DEW bind error - "${current}" and "${target}" arguments must be an array!`);
			return;
		}

		const id = getId();
		const left = { object: current[0], field: current[1] };
		const right = { object: target[0], field: target[1] };

		this._attach(left, right, current[2], current[3], id);
		this._attach(right, left, target[2], target[3], id);

		return id;
	},

	_attach(current, target, modifier, trigger, id = getId()) {
		this._genAccessors(current.object, current.field, trigger);
		this._addJoint(id, current.object, current.field, {
			object  : target.object,
			field   : target.field,
			modifier: typeof modifier == 'function' ? modifier : null
		});

		_bondings.set(id, { current, target });

		return id;
	},

	_genAccessors(object, field, trigger) {
		const meta = `__bind__${field}`;
		if (meta in object) return;

		const sideId = getId();

		define(object, meta, {
			value: {
				joints : new Map(),
				value  : object[field],
				trigger: typeof trigger == 'function' ? trigger : null,
				sideId
			},
			config: true
		});

		define(object, field, {
			get: () => object[meta].value,
			set: (value) => { this._setData(object, field, value) },
			config: true,
			enumer: true
		});
	},

	_addJoint(id, object, field, joint) {
		const meta = object[`__bind__${field}`];
		meta.joints.set(id, joint);
		this._applyValue(joint.object, joint.field, meta.value, joint.modifier);
	},

	_applyValue(object, field, value, modifier) {
		const meta = `__bind__${field}`;
		const val = typeof modifier == 'function' ? modifier(value) : value;

		if (meta in object) {
			object[meta].value = val;
		} else {
			object[field] = val;
		}
	},

	_setData(object, field, data) {
		const srcValue = data.value !== undefined ? data.value : data;
		const meta = object[`__bind__${field}`];
		meta.value = srcValue;

		if (data.value === undefined && meta.trigger) {
			meta.trigger(srcValue);
		}

		meta.joints.forEach((joint) => {
			const { object: jObject, field: jField, modifier } = joint;
			const value = modifier ? modifier(srcValue) : srcValue;

			if (jObject === data.object && jField === data.field) {
				return;

			} else if (('__bind__' + jField) in jObject) {
				jObject[jField] = { value, object, field };

			} else {
				jObject[jField] = value;
			}
		});
	}
}

export default bind;