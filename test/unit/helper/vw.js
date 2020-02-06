import vw from '../../../core/helper/vw';

test('vw', () => {
    expect(vw(25)).toBe(window.innerWidth * 0.25);
});