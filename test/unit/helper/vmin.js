import vmin from '../../../core/helper/vmin';

test('vmin', () => {
    const side = Math.min(window.innerWidth, window.innerHeight);
    expect(vmin(25)).toBe(side * 0.25);
});