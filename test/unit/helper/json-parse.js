import jsonParse from '../../../core/helper/json-parse';

test('jsonParse', () => {
    expect(jsonParse(`{ a: text, b: 'text2', "c": 123 }`))
        .toBeObject({ a: 'text', b: 'text2', c: 123 });
});