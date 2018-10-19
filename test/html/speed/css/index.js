var place = $html.create("span", "place").text("place");
for (var i = 0; i < 1000; i++)
    $html.body.after(place);

var elemNative = document.querySelectorAll(".place");
log.time("css - native");
for (var j = 0; j < elemNative.length; j++)
    elemNative[j].style.background = "red";
log.timeEnd("css - native");

var elemDew = $html.select(".place");
log.time("css - dew");
elemDew.style("background", "red");
log.timeEnd("css - dew");

var elemJquery = $(".place");
log.time("css - jquery");
elemJquery.css("background", "red");
log.timeEnd("css - jquery");