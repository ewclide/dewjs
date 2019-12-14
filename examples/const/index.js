const { constManager } = DEW;

const NAME_SPACE_1 = constManager.create([
    'ONE', 'TWO', 'THREE'
]);

console.log('namespace', NAME_SPACE_1)

const NAME_SPACE_2 = constManager.create({
    ONE: { id: 1 },
    TWO: { id: 2 },
    THREE: { id: 3 }
});

console.log('namespace2', NAME_SPACE_2)
console.log('getdata n2', constManager.getData(NAME_SPACE_2, NAME_SPACE_2.TWO))
console.log('getdata n1', constManager.getData(NAME_SPACE_1, NAME_SPACE_1.TWO))
console.log('getname n2', constManager.getName(NAME_SPACE_2, NAME_SPACE_2.TWO))
console.log('getname n1', constManager.getName(NAME_SPACE_1, NAME_SPACE_1.TWO))
console.log('has', constManager.has(NAME_SPACE_2, NAME_SPACE_2.TWO))
console.log('has', constManager.has(NAME_SPACE_2, 200))

constManager.erase(NAME_SPACE_2);

console.log(constManager.getData(NAME_SPACE_2, NAME_SPACE_2.TWO))

const key = Symbol('my_key');

const NAME_SPACE_3 = constManager.create({
    ONE: { id: 1 },
    TWO: { id: 2 },
    THREE: { id: 3 }
}, key);

console.log('getdata n3', constManager.getData(NAME_SPACE_3, NAME_SPACE_3.TWO))
console.log('getdata n3', constManager.getData(NAME_SPACE_3, NAME_SPACE_3.TWO, key))