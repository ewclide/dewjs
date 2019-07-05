const { constManager } = DEW;

const NAME_SPACE_1 = constManager.create([
    'ONE', 'TWO', 'THREE'
]);

console.log(NAME_SPACE_1)

const NAME_SPACE_2 = constManager.create({
    ONE: { id: 1 },
    TWO: { id: 2 },
    THREE: { id: 3 }
});

console.log(NAME_SPACE_2)
console.log(constManager.getData(NAME_SPACE_2, NAME_SPACE_2.TWO))
console.log(constManager.getName(NAME_SPACE_2, NAME_SPACE_2.TWO))

constManager.erase(NAME_SPACE_2);

console.log(constManager.getData(NAME_SPACE_2, NAME_SPACE_2.TWO))