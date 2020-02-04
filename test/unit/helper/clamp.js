import clampValue from '../../../core/helper/clamp';

test('clamp', () => {
    const borders = [0, 10];

    expect(clampValue(-5, ...borders)).toBe(0);
    expect(clampValue(0, ...borders)).toBe(0);
    expect(clampValue(5, ...borders)).toBe(5);
    expect(clampValue(10, ...borders)).toBe(10);
    expect(clampValue(15, ...borders)).toBe(10);
});