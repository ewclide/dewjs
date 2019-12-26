const tpl = `
%name

%{!async ? name : name + 2}

@if (async) {
    console.log('is async')
    {. sync }
}

@if (async) {:
    *async* %name;
    *async* %name;
}

@for (let arg of args) {:
    ***%arg.name*** : *%arg.type*
}

( %join(args, arg => {. **%arg.name** : *%arg.type* }) ) => %{ async ?. Promise(%returns[0]) : %returns[0] }
`;

const render = create(tpl, {
    vars: ['name', 'args', 'desc', 'returns', 'example', 'async'],
    // debug: true
})
const result = render({
    async: true,
    name: 'someFunction',
    args: [
        {  name: 'value', type: 'String' },
        {  name: 'offset', type: 'Number' }
    ],
    desc: `test description`,
    returns: ['String'],
    example: {
        content: `
        const getName = idGetter('unique_');
        getName(); // unique_1
        getName(); // unique_2
        // ...unique_++
        `,
        type: 'js'
    }
});

console.log(tpl, render)
console.log(result)