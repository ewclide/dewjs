import randi from '../../../core/helper/rand-i';
import accuracy from '../../../core/helper/accuracy';

test('randi', () => {
    expect(randi()).toBeWithin(-0.1, 9.1);
    expect(randi(0, 5)).toBeWithin(-0.1, 5.1);
    expect(accuracy(randi())).toBe(0);
});