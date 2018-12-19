const first = {
    a: 'first A',
    b: 'first B'
}

const second = {
    a: 'second A'
}

const third = {
    a: 'third A'
}

DEW.bind.change(first, 'b', (v) => console.log(v));
first.b = 'New value!';
/** New value! */

DEW.bind.fields({
    type: 'left',
    left: { object: first, field: 'a' },
    right: { object: second, field: 'a' },
    modifier: (v) => v + '!?',
    trigger: (v) => console.log(`changed - ${v}`)
});

first.a = 'first changed';
console.log(second.a);
/** changed - first changed
 * first changed!?
*/

// DEW.bind.left([first, 'a'], [second, 'a'], );

