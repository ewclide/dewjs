import clampOut from '../../../core/helper/clamp-out';

test('clampOut', () => {
    const borders = [10, 50];

    expect(clampOut(0, ...borders)).toBe(0);
    expect(clampOut(30, ...borders)).toBe(50);
    expect(clampOut(35, ...borders)).toBe(50);
    expect(clampOut(70, ...borders)).toBe(70);
});