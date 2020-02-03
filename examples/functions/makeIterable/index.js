const { makeIterable } = Dew.helper;

class List {
    constructor() {
		this._index = 0;

        makeIterable(this, (product) => {
			product.value = 'child' + this._index++;
			product.done = this._index > 10;

            if (product.done) {
                this._index = 0;
            }
        });
    }
}

const list = new List();

for (const child of list) {
	console.log(child)
}

console.log('--------');

for (const child of list) {
	console.log(child)
}

