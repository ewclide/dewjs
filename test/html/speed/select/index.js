var place = $html.create("div", "place").html("<span></span>");
for (var i = 0; i < 1000; i++)
    $html.body.after(place);

log.time("select - native");
document.querySelectorAll(".place");
log.timeEnd("select - native");

log.time("select - dew");
$html.select(".place");
log.timeEnd("select - dew");

log.time("select - jquery");
$(".place");
log.timeEnd("select - jquery");

// incremental select
log.time("incremental select - native");
var elem = document.querySelectorAll(".place");
for (var j = 0; j < elem.length; j++)
    elem[j].querySelectorAll("span");
log.timeEnd("incremental select - native");

log.time("incremental select - dew");
$html.select(".place").select("span");
log.timeEnd("incremental select - dew");

log.time("incremental select - jquery");
$(".place").find("span");
log.timeEnd("incremental select - jquery");
