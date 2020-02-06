import vh from '../../../core/helper/vh';

test('vh', () => {
    expect(vh(25)).toBe(window.innerHeight * 0.25);
});