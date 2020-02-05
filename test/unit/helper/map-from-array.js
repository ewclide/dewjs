import mapFromArray from '../../../core/helper/map-from-array';

test('mapFromArray', () => {
    const props = [
        ['one', 1],
        ['two', 2],
        ['three', 3]
    ];

    const result = new Map(Object.entries({
        one: 1,
        two: 2,
        three: 3
    }));

    expect(mapFromArray(props)).toEqual(result);
});