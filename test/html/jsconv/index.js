var jsForm = {
    tag : "form",
    attrs : {
        action : ""
    },
    nodes : [
        {
            tag : "input",
            nodeName : "name",
            attrs : {
                name : "name",
                type : "text"
            },
            events : {
                input : function(e, that, main){
                    // log(e)
                    that.value(e.target.value);
                    // main.style("background", "red");
                }
            }
        },
        {
            tag  : "button",
            text : "apply"
        }
    ]
}

var form = $html.createFromJson(jsForm);

$html.select(".app").append(form);

form.node.name.value("one");

$html.select(".more").append(form);

form.node.name.value("two");

// var json = $html.select(".app").createJson();
// log.json(json)
