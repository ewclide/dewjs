import floatParse from '../../../core/helper/float-parse';

test('floatParse', () => {
    expect(floatParse('as12,5%7d')).toBe(12.57);
    expect(floatParse('12.57')).toBe(12.57);
});