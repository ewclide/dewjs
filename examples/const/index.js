const { enums } = Dew.common;

const NAME_SPACE_1 = enums.create([
    'ONE', 'TWO', 'THREE'
]);

console.log('namespace', NAME_SPACE_1)

const NAME_SPACE_2 = enums.create({
    ONE: { id: 1 },
    TWO: { id: 2 },
    THREE: { id: 3 }
});

console.log('namespace2', NAME_SPACE_2)
console.log('getdata n2', enums.getData(NAME_SPACE_2, NAME_SPACE_2.TWO))
console.log('getdata n1', enums.getData(NAME_SPACE_1, NAME_SPACE_1.TWO))
console.log('getname n2', enums.getName(NAME_SPACE_2, NAME_SPACE_2.TWO))
console.log('getname n1', enums.getName(NAME_SPACE_1, NAME_SPACE_1.TWO))
console.log('has', enums.has(NAME_SPACE_2, NAME_SPACE_2.TWO))
console.log('has', enums.has(NAME_SPACE_2, 200))

enums.erase(NAME_SPACE_2);

console.log(enums.getData(NAME_SPACE_2, NAME_SPACE_2.TWO))

const key = Symbol('my_key');

const NAME_SPACE_3 = enums.create({
    ONE: { id: 1 },
    TWO: { id: 2 },
    THREE: { id: 3 }
}, key);

console.log('getdata n3', enums.getData(NAME_SPACE_3, NAME_SPACE_3.TWO))
console.log('getdata n3', enums.getData(NAME_SPACE_3, NAME_SPACE_3.TWO, key))