import vmax from '../../../core/helper/vmax';

test('vmax', () => {
    const side = Math.max(window.innerWidth, window.innerHeight);
    expect(vmax(25)).toBe(side * 0.25);
});