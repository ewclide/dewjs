import idGetter from './id-getter';

const $id = Symbol('instance_id');

export default function publish(Input, methods, props) {
    const list = {};
	const getInstId = idGetter(Input.name + '__');

    function Output() {
        const id = getInstId();
        list[id] = new Input(...arguments);
        this[$id] = id;
    }

    if (methods && methods.length) {
		methods.forEach((method) => {
			if (!(method in Input.prototype)) {
				console.error(`${Input.name} class have not the "${method}" method!`);
				return;
			}

			Output.prototype[method] = function() {
				const obj = list[this[$id]];
				return obj[method].apply(obj, arguments);
			}
		});

	} else {
		throw new Error(`The class "${Input.name}" must have at least one public method`);
	}

	if (props) {
		props.forEach((prop) => {
			Object.defineProperty(Output.prototype, prop, {
				configurable: false,
				get: function() {
					return list[this[$id]][prop]
				},
				set: function(value) {
					list[this[$id]][prop] = value;
				}
			});
		});
	}

    return Output;
}