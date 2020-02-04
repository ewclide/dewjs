import clampSide from '../../../core/helper/clamp-side';

test('clampSide', () => {
    const point = 50;

    expect(clampSide(0, point)).toBe(0);
    expect(clampSide(50, point)).toBe(50);
    expect(clampSide(70, point)).toBe(50);
    expect(clampSide(70, point, true)).toBe(70);
    expect(clampSide(50, point, true)).toBe(50);
    expect(clampSide(0, point, true)).toBe(50);
});