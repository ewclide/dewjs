let jsForm = {
    tag : "form",
    value : "test",
    attrs : {
        action : ""
    },
    nodes : [
        {
            key  : "phone",
            tag  : "input",
            type : "text",
            name : "phone",
            attrs : {
                autocomplete : "off",
                placeholder : "Enter phone"
            },
            events : {
                input : function(e, that, main){
                    log(e, that, main)
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

let form = $html.createFromJSON(jsForm);
let h1 = $html.create("h1").text("Test JSON converter");

$html.body.prepend(h1);
$html.select(".app").append(form);

form.node.phone.value("one");

$html.select(".more").append(form);

form.node.phone.value("two");

log(form.length)

// let json = $html.select(".app").createJSON();
// log.json(json)
