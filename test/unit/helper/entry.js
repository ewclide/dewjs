import entry from '../../../core/helper/entry';

test('entry', () => {
    const borders = [0, 10];

    expect(entry(-5, ...borders)).toBe(false);
    expect(entry(0, ...borders)).toBe(true);
    expect(entry(0, ...borders, true)).toBe(false);
    expect(entry(5, ...borders)).toBe(true);
    expect(entry(10, ...borders)).toBe(true);
    expect(entry(10, ...borders, true)).toBe(false);
    expect(entry(15, ...borders)).toBe(false);
});