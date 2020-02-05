import limitCalls from '../../../core/helper/limit-calls';

test('limitCalls', () => {
    const cb = jest.fn();
    const handler = limitCalls(cb, 2);

    handler(1, 1);
    handler(2, 2);
    handler(3, 3);

    expect(cb.mock.calls.length).toBe(2);
    expect(cb.mock.calls[0][0]).toBe(1);
    expect(cb.mock.calls[0][1]).toBe(1);
    expect(cb.mock.calls[1][0]).toBe(2);
    expect(cb.mock.calls[1][1]).toBe(2);
});