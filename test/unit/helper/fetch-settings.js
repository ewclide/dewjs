import fetchSettings from '../../../core/helper/fetch-settings';

test('fetchSettings', () => {
    const desc = {
        size:  { defaultValue: 1, filter: v => v < 5, type: Number },
        color: { defaultValue: 'red', oneOf: ['red', 'blue', 'green'], type: String },
        list:  { arrayOf: [Number, String] },
        all:   { required: true, filter: v => v < 5, oneOfTypes: [Number, String] },
        any: 0,
    };

    expect(fetchSettings({}, desc)).toEqual({});
});