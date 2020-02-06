import randf from '../../../core/helper/rand-f';
import accuracy from '../../../core/helper/accuracy';

test('randf', () => {
    expect(randf()).toBeWithin(0, 1);
    expect(randf(0, 5)).toBeWithin(0, 5);

    const value = randf(0, 5, 2);
    expect(value).toBeWithin(0, 5);
    expect(accuracy(value)).toBeWithin(-0.1, 2.1);
});