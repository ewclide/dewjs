// create many div elements for appending
var place = $html.create("div", "place");
for (var i = 0; i < 500; i++)
    $html.body.after(place);

// places and elements
var text = $html.create("p"),
    natText = document.createElement("p"),
    jqText = $("<p></p>");

var natPlace = document.querySelectorAll(".place"),
    jqPlace = $(".place");

log.time("native");
for (var j = 0; j < natPlace.length; j++)
{
    let elem = natText.cloneNode(true);
    natPlace[j].appendChild(elem);
}
log.timeEnd("native");

log.time("dew");
place.append(text);
log.timeEnd("dew");

log.time("jquery");
jqPlace.append(jqText);
log.timeEnd("jquery");

var h1 = $html.create("h1").text("Test");
$html.select(".app").append(h1);
$html.select(".other").append(h1);
h1.style("color", "red");
