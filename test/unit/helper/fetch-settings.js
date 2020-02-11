import fetchSettings from '../../../core/helper/fetch-settings';
import { swapConsole, getConsoleMessage } from '../utils';

test('fetchSettings', () => {
    swapConsole();

    const prop1 = { type: Number };
    const prop2 = { oneofTypes: [Number, String] };
    const prop3 = { arrayof: [Number, String] };

    const prop4 = { required: true };
    const prop5 = { defaultValue: 1 };
    const prop6 = { defaultValue: [1], arrayof: [Number] };

    const prop7 = { filter: v => v < 5, type: Number };
    const prop8 = { oneof: ['red', 'blue', 'green'], type: String };
    const prop9 = { required: true, filter: v => v < 5, oneof: [1, 2, 3, 6], oneofTypes: [Number], defaultValue: 1 };

    const prop10 = { required: true, type: Number };
    const prop11 = { required: true, attribute: 'some', type: Number };
    const prop12 = { attribute: 'flag', type: Boolean };
    const prop13 = { attribute: 'list', arrayof: [Number, String] };

    // type
    expect(fetchSettings({ prop1: 12 }, { prop1 })).toEqual({ prop1: 12 });
    expect(fetchSettings({ prop1: '12' }, { prop1 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Value "12" of property "prop1" must be a type Number', '']);

    // oneofTypes
    expect(fetchSettings({ prop2: 1 }, { prop2 })).toEqual({ prop2: 1 });
    expect(fetchSettings({ prop2: true }, { prop2 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Value "true" of property "prop2" must be one of types [Number,String]', '']);

    // arrayof
    expect(fetchSettings({ prop3: [] }, { prop3 })).toEqual({ prop3: [] });
    expect(fetchSettings({ prop3: [1] }, { prop3 })).toEqual({ prop3: [1] });
    expect(fetchSettings({ prop3: [true] }, { prop3 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Value of element[1] "true" of property "prop3" must be an array of types [Number,String]', '']);
    expect(fetchSettings({ prop3: 1 }, { prop3 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Value "1" of property "prop3" must be an array of types [Number,String]', '']);

    // required, defaultValue
    expect(fetchSettings({}, { prop6 })).toEqual({ prop6: [1] });
    expect(fetchSettings({}, { prop5 })).toEqual({ prop5: 1 });
    expect(fetchSettings({ prop4: 1 }, { prop4 })).toEqual({ prop4: 1 });
    expect(fetchSettings({}, { prop4 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Property "prop4" is expected in settings object', '']);

    // short form
    expect(fetchSettings({}, { short: 2 })).toEqual({ short: 2 });

    // filter
    expect(fetchSettings({ prop7: 2 }, { prop7 })).toEqual({ prop7: 2 });
    expect(fetchSettings({ prop7: 6 }, { prop7 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Value "6" of property "prop7" can\'t be passed throught filter', '']);

    // oneof
    expect(fetchSettings({ prop8: 'red' }, { prop8 })).toEqual({ prop8: 'red' });
    expect(fetchSettings({ prop8: 'yellow' }, { prop8 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Value "yellow" of property "prop8" is unacceptable, it must be one of [red,blue,green]', '']);

    // together
    expect(fetchSettings({ prop9: 1 }, { prop9 })).toEqual({ prop9: 1 });
    expect(fetchSettings({}, { prop9 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Property "prop9" is expected in settings object', '']);
    expect(fetchSettings({ prop9: 6 }, { prop9 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Value "6" of property "prop9" can\'t be passed throught filter', '']);
    expect(fetchSettings({ prop9: 4 }, { prop9 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Value "4" of property "prop9" is unacceptable, it must be one of [1,2,3,6]', '']);
    expect(fetchSettings({ prop9: '4' }, { prop9 })).toEqual({});
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Value "4" of property "prop9" must be a type Number', '']);

    // strict
    expect(fetchSettings({ suddenly: 1 }, { expect: 1 })).toEqual({ expect: 1 });
    expect(getConsoleMessage('error')).toEqual(['Error:', 'Unexpected property "suddenly"', '']);
    expect(fetchSettings({ suddenly: 1 }, { expect: 1 }, { strict: false })).toEqual({ suddenly: 1, expect: 1 });

    // throw error
    expect(() => fetchSettings({}, { prop4 }, { cast: true })).toThrowError('Property "prop4" is expected in settings object');

    // get from attribute
    const element = document.createElement('div');
    element.setAttribute('data-prop10', 4);
    element.setAttribute('some', 5);
    element.setAttribute('flag', '');
    element.setAttribute('list', '[1, "a", 2]');
    expect(fetchSettings({}, { prop10 }, { element })).toEqual({ prop10: 4 });
    expect(fetchSettings({}, { prop11 }, { element })).toEqual({ prop11: 5 });
    expect(fetchSettings({}, { prop12 }, { element })).toEqual({ prop12: true });
    expect(fetchSettings({}, { prop13 }, { element })).toEqual({ prop13: [1, 'a', 2] });
});