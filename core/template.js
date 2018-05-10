import {printErrors}  from './functions';

export class Template
{
    constructor(str, name)
    {
        this._htl = null;
        this._render = function(){};
        this._create(str, name);
    }

    get isTemplate()
    {
        return true;
    }

    appendTo(htl)
    {
        this._htl = $html.convert(htl);
        return this;
    }

    draw(data)
    {
        try {
            this._htl
            ? this._htl.html(this._render(data))
            : printErrors('Dew template error: "it must be append to DOM before drawing"');
        }
        catch (e) {
            printErrors('Dew template error: "' + e.message + '"');
        }
    }

    _create(str, args)
    {
        var fn = "var ", 
            tokens = str.replace(/\<&/g, "<&#").split(/\<&|&\>/gi);

        if (Array.isArray(args))
            args.forEach( arg => fn += arg + "=data." + arg + "," );

        fn += "echo=function(s){_r+=s},_r='';",

        tokens.forEach( token => {
            token[0] == "#"
            ? fn += token.slice(1).replace(/:=/g, "_r+=") + ";\n"
            : fn += "_r+=`" + token + "`;";
        })
        fn += " return _r";

        try {
            this._render = new Function("data", fn);
        }
        catch (e) {
            printErrors('Dew template error: "' + e.message + '"');
            this._render = function(){};
        }
    }
}
