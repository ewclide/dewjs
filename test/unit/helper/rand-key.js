import randKey from '../../../core/helper/rand-key';

test('randKey', () => {
    expect(randKey()).toMatch(/.{15}/g);
    expect(randKey(5)).toMatch(/.{5}/g);
    expect(randKey(10, ['upper', 'lower', 'numbers'])).toMatch(/\w{10}/g);
});