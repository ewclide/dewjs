import makeIterable from '../../../core/helper/make-iterable';

test('makeIterable', () => {
    class List {
        constructor() {
            this._index = 0;

            makeIterable(this, (product) => {
                product.value = 'child' + this._index++;
                product.done = this._index > 5;

                if (product.done) {
                    this._index = 0;
                }
            });
        }
    }

    const list = new List();
    const result = [];

    for (const child of list) {
        result.push(child)
    }

    expect(result).toEqual(['child0', 'child1', 'child2', 'child3', 'child4']);

    result.length = 0;

    for (const child of list) {
        result.push(child)
    }

    expect(result).toEqual(['child0', 'child1', 'child2', 'child3', 'child4']);
});