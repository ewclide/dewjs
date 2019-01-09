import {printErr, idGetter} from './functions';
import {define} from './object';

const getId = idGetter();
const _nodeList = new Map();
const _bondList = new Map();

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
		return () => fn.apply(context, arguments);
	},

	trigger(object, field, trigger) {
		this._createNode(object, field, trigger);
	},

	break(id) {
		if (Array.isArray(id)) {
			id.forEach((i) => this.break(i));

		} else {
			if (!_bondList.has(id)) return;

			const bond = _bondList.get(id);
			const node = bond.current;

			node.bonds.delete(bond.target.id);
			_bondList.delete(id);
		}
	},

	detach(object, field) {
		const nodeId = object.__bind__ + field;
		if (!_nodeList.has(nodeId)) return;

		const { bonds, value } = _nodeList.get(nodeId);

		bonds.forEach((bond) => _bondList.delete(bond.id));
		bonds.clear();

		_nodeList.delete(nodeId);

		define(object, field, { value, enumer: true });
	},

	clear(object, field) {
		const nodeId = object.__bind__ + field;

		if (_nodeList.has(nodeId)) {
			_nodeList.get(nodeId).nodes.clear();
		}
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
			printErr('DEW bind error - first two arguments must be an array!');
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
			printErr('DEW bind error - first two arguments must be an array!');
			return;
		}

		const ids = [];
		const left = { object: current[0], field: current[1] };
		const right = { object: target[0], field: target[1] };

		const leftBind = this._attach(left, right, target[2], current[3]);
		const rightBind = this._attach(right, left, current[2], target[3]);

		ids.push(leftBind, rightBind);

		return ids;
	},

	_attach(current, target, modifier, trigger) {
		const currentNode = this._createNode(current.object, current.field, trigger);
		const targetNode = this._createNode(target.object, target.field);

		if (typeof modifier !== 'function') {
			modifier = (v) => v;
		}

		const bondId = getId();
		const bond =  {
			id     : bondId,
			current: currentNode,
			target : targetNode,
			modifier
		};

		_bondList.set(bondId, bond);
		currentNode.bonds.set(targetNode.id, bond);
		targetNode.value = modifier(currentNode.value);

		return bondId;
	},

	_createNode(object, field, trigger) {
		if (!object.__bind__) {
			const objectId = getId();
			define(object, '__bind__', {
				value: objectId,
				config: true
			});
		}

		if (typeof trigger !== 'function') {
			trigger = null;
		}

		const nodeId = object.__bind__ + field;

		if (_nodeList.has(nodeId)) {
			const node = _nodeList.get(nodeId);
			if (trigger) node.trigger = trigger;

			return node;

		} else {
			const node = {
				object, field,
				id: nodeId,
				value: object[field],
				bonds: new Map(),
				trigger
			}

			_nodeList.set(nodeId, node);

			define(object, field, {
				get: () => _nodeList.get(nodeId).value,
				set: (value) => this._set(nodeId, [nodeId], value),
				config: true,
				enumer: true
			});

			return node;
		}
	},

	_set(nodeId, steps, value) {
		const node = _nodeList.get(nodeId);
		node.value = value;

		if (nodeId === steps[0] && node.trigger) {
			node.trigger(value);
		}

		if (!node.bonds.size) return;

		node.bonds.forEach((bond) => {
			const { modifier, target } = bond;

			if (target && !steps.includes(target.id)) {
				steps.push(target.id);
				this._set(target.id, steps, modifier(value));
			}
		});
	}
}

export default bind;