var jsForm = {
    tag : "form",
    value : "test",
    attrs : {
        action : ""
    },
    nodes : [
        {
            tag  : "input",
            type : "text",
            name : "phone",
            nodeName : "phone",
            attrs : {
                autocomplete : "off"
            },
            events : {
                input : function(e, that, main){
                    log(that)
                    that.value(e.target.value);
                    // main.style("background", "red");
                }
            }
        },
        {
            tag   : "input",
            type  : "checkbox",
            name  : "use",
            value : "yes"
        },
        {
            tag  : "button",
            text : "apply"
        }
    ]
}

var form = $html.createFromJSON(jsForm);

$html.select(".app").append(form);

// form.node.phone.value("one");

$html.select(".more").append(form);

// form.node.phone.value("two");

// var json = $html.select(".app").createJSON();
// log.json(json)
