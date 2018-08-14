var h1 = $html.select("h1");
var attrs = h1.getAttr();
log(attrs)
h1.setAttr("data-new", "new");
h1.unsetAttr();

// get attributes
var elNat = document.querySelectorAll(".place");
log.time("native");
for (var i = 0; i < 1000; i++)
    elNat[0].getAttribute("data-test");
log.timeEnd("native");

var elDew = $html.select(".place");
log.time("dew");
for (var i = 0; i < 1000; i++)
    elDew.getAttr("data-test");
log.timeEnd("dew");

var elJq = $(".place");
log.time("jquery");
for (var i = 0; i < 1000; i++)
    elJq.attr("data-test");
log.timeEnd("jquery");

// set attributes
log.time("native");
for (var i = 0; i < 1000; i++)
    for (var j = 0; j < elNat.length; j++)
        elNat[j].setAttribute("data-native", "native");
log.timeEnd("native");

log.time("dew");
for (var i = 0; i < 1000; i++)
    elDew.setAttr("data-dew", "dew");
log.timeEnd("dew");

log.time("jquery");
for (var i = 0; i < 1000; i++)
    elJq.attr("data-jq", "jq");
log.timeEnd("jquery");