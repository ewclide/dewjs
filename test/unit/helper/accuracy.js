import accuracy from '../../../core/helper/accuracy';

test('accuracy', () => {
    expect(accuracy(0.1)).toBe(1);
    expect(accuracy(0.001)).toBe(3);
});