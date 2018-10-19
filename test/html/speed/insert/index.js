var place = $html.create("div", "place");
for (var i = 0; i < 1000; i++)
    $html.body.after(place);

var text = $html.create("p"),
    natText = document.createElement("p"),
    jqText = $("<p></p>");

var natPlace = document.querySelectorAll(".place"),
    jqPlace = $(".place");

log.time("insert - native");
for (var j = 0; j < natPlace.length; j++)
{
    let elem = natText.cloneNode(true);
    natPlace[j].appendChild(elem);
}
log.timeEnd("insert - native");

log.time("insert - dew");
place.append(text);
log.timeEnd("insert - dew");

log.time("insert - jquery");
jqPlace.append(jqText);
log.timeEnd("insert - jquery");