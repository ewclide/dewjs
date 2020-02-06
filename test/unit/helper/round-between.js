import roundBetween from '../../../core/helper/round-between';

test('roundBetween', () => {
    expect(roundBetween(0.5)).toBe(1);
    expect(roundBetween(5, 2, 8)).toBe(8);
    expect(roundBetween(4, 2, 8)).toBe(2);
    expect(roundBetween(1, 2, 8)).toBe(2);
    expect(roundBetween(10, 2, 8)).toBe(8);
});