const first = {
    a: 'first A',
    b: 'first B',
    c: 0
}

const second = {
    a: 'second A',
    c: 10
}

const third = {
    a: 'third A',
    c: 20
}

DEW.bind.onchange(first, 'b', (v) => console.log(v));
first.b = 'New value!';
/** New value! */
console.log('----------------');

DEW.bind.fields({
    type: 'sided',
    left: { object: first, field: 'a' },
    right: { object: second, field: 'a' },
    modifier: (v) => v + '!?',
    trigger: (v) => console.log(v)
});

first.a = 'first.a changed';
console.log(second.a);
/** first.a changed
 * first changed!?
*/
console.log('----------------');

DEW.bind.sided([first, 'a'], [second, 'a'], (v) => v + '...', (v) => console.log(v));
first.a = 'first.a changed - 2';
console.log(second.a);
/** first changed... */
console.log('----------------');

DEW.bind.cross(
    [first,  'c', (v) => v+10, (v) => console.log('first.c changed to: ' + v)],
    [second, 'c', (v) => v-10, (v) => console.log('second.c changed to: ' + v)]
);
first.c = 7;
console.log(first.c, second.c);
second.c = 30;
console.log(first.c, second.c);
/**
 * first.c changed to: 7
 * 7 17
 * second.c changed to: 30
 * 20 30
 */
console.log('----------------');

DEW.bind.cross(
    [second, 'c', (v) => v+10 ],
    [third, 'c', (v) => v-10, (v) => console.log('third.c changed to: ' + v)]
);
first.c = 15;
console.log(first.c, second.c, third.c);
second.c = 20;
console.log(first.c, second.c, third.c);
/**
 * first.c changed to: 15
 * 15 25 35
 * second.c changed to: 20
 * 10 20 30
 *  */
console.log('----------------');
