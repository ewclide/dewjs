let place = $html.create('div', 'place');
    place.setAttr('data-test', 'value');

$html.body.after(place);

// get attributes
let elNat = document.querySelectorAll(".place");
log.time("get - native");
for (let i = 0; i < 1000; i++)
    elNat[0].getAttribute("data-test");
log.timeEnd("get - native");

let elDEW = $html.select(".place");
log.time("get - dew");
for (let i = 0; i < 1000; i++)
    elDEW.getAttr("data-test");
log.timeEnd("get - dew");

let elJq = $(".place");
log.time("get - jquery");
for (let i = 0; i < 1000; i++)
    elJq.attr("data-test");
log.timeEnd("get - jquery");

// set attributes
log.time("set - native");
for (let i = 0; i < 1000; i++)
    elNat[0].setAttribute("data-n", "value");
log.timeEnd("set - native");

elDEW = $html.select(".place");
log.time("set - dew");
for (let i = 0; i < 1000; i++)
    elDEW.setAttr("data-d", "value");
log.timeEnd("set - dew");

log.time("set - jquery");
for (let i = 0; i < 1000; i++)
    elJq.attr("data-j", "value");
log.timeEnd("set - jquery");