var form = {
    tag : "form",
    attrs : {
        action : "/"
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
                input : function(e){
                    $form.node("name").value(e.target.value);
                }
            }
        },
        {
            tag  : "button",
            text : "apply"
        }
    ]
}

var $form = $html.createFromJson(form);

$html.select(".app").append($form);

$form.node("name").value("one");

$html.select(".more").append($form);

// var json = $html.select(".app").convertToJson();
// log.json(json)
