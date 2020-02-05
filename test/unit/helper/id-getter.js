import idGetter from '../../../core/helper/id-getter';

test('idGetter', () => {
    const getName = idGetter('name_');
    const getId = idGetter();

	expect(getName()).toBe('name_0');
	expect(getName()).toBe('name_1');
    expect(getName()).toBe('name_2');

	expect(getId()).toBe(0);
	expect(getId()).toBe(1);
	expect(getId()).toBe(2);
});