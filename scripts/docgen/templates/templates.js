const functionTpl = {
vars: ['name', 'description', 'async', 'args', 'desc', 'returns', 'example'],
body: `
##
### %name
( %join(args, arg => {. ***%arg.name*** : *%arg.type* }) ) => %{ async ?. Promise(%returns[0]) : %returns[0] }

%description

@for (let arg of args) {:
- *%arg.name* %{arg.required ?.  : } - %arg.description
}

@if (example) {.
\`\`\`%example.type
%example.content
\`\`\`
}
`
};

module.exports = {
    functionTpl
};