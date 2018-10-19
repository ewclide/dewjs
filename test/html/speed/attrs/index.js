var place = $html.create('div', 'place');
    place.setAttr('data-test', 'value');

$html.body.after(place);

// get attributes
var elNat = document.querySelectorAll(".place");
log.time("get - native");
for (var i = 0; i < 1000; i++)
    elNat[0].getAttribute("data-test");
log.timeEnd("get - native");

var elDew = $html.select(".place");
log.time("get - dew");
for (var i = 0; i < 1000; i++)
    elDew.getAttr("data-test");
log.timeEnd("get - dew");

var elJq = $(".place");
log.time("get - jquery");
for (var i = 0; i < 1000; i++)
    elJq.attr("data-test");
log.timeEnd("get - jquery");

// set attributes
log.time("set - native");
for (var i = 0; i < 1000; i++)
    elNat[0].setAttribute("data-n", "value");
log.timeEnd("set - native");

elDew = $html.select(".place");
log.time("set - dew");
for (var i = 0; i < 1000; i++)
    elDew.setAttr("data-d", "value");
log.timeEnd("set - dew");

log.time("set - jquery");
for (var i = 0; i < 1000; i++)
    elJq.attr("data-j", "value");
log.timeEnd("set - jquery");