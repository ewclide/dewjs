import zeroPad from '../../../core/helper/zero-pad';

test('zeroPad', () => {
    expect(zeroPad(25)).toBe('25');
    expect(zeroPad(25, 5)).toBe('00025');
});