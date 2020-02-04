import formatNumber from '../../../core/helper/format-number';

test('formatNumber', () => {
    expect(formatNumber(10000.05)).toBe('10 000');
    expect(formatNumber(1000000)).toBe('1 000 000');
    expect(formatNumber(1000, '  ')).toBe('1  000');
});