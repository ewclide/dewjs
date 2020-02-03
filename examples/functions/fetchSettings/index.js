const { fetchSettings } = Dew.helper;

class A {};

const config = {
	defaults: {
		prop1: 0,
		prop2: null,
		prop3: true,
		prop5: null,
		prop6: 'red'
	},
	required: {
		prop4: true
	},
	filter: {
		prop2: v => v.length <= 3
	},
	types: {
		prop3: 'boolean',
		prop4: 'number',
		prop5: A
	},
	rates: {
		prop6: ['red', 'blue']
	}
}

const settings =  {
	prop1: 0,
	prop2: 'qwe',
	prop3: true,
	prop4: 3,
	prop5: new A(),
	// prop6: 'green',
	prop6: 'red'
}

console.time('one fetch');
console.log(fetchSettings(settings, config))
console.timeEnd('one fetch');

const res = [];
console.time('fetch');
for (let i = 0; i < 10000; i++) {
	res.push(fetchSettings(settings, config));
}
console.timeEnd('fetch');
console.log(res.length)

console.time('assign');
for (let i = 0; i < 10000; i++) {
	res.push(Object.assign({}, settings, config.defaults));
}
console.timeEnd('assign');
console.log(res.length)