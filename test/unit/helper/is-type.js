import isType from '../../../core/helper/is-type';
import html from '../../../core/common/html';

test('isType', () => {
    const element = document.createElement('div');
    const h1 = html.create('h1');

	expect(isType(15, ['string', 'number'])).toBe(true);
	expect(isType(15, 'number')).toBe(true);
	expect(isType([15], 'array')).toBe(true);
	expect(isType(true, 'boolean')).toBe(true);
	expect(isType(() => {}, 'function')).toBe(true);
	expect(isType(element, 'DOM')).toBe(true);
    expect(isType(h1, 'HTMLTools')).toBe(true);

	expect(isType(15)).toBe('number');
	expect(isType('15')).toBe('string');
	expect(isType([15])).toBe('array');
	expect(isType(true)).toBe('boolean');
	expect(isType(() => {})).toBe('function');
	expect(isType(element)).toBe('DOM');
	expect(isType(h1)).toBe('HTMLTools');
});