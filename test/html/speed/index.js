log.time("native");
for (var i = 0; i < 1000; i++)
    document.querySelectorAll(".app p");
log.timeEnd("native");

log.time("dew");
for (var i = 0; i < 1000; i++)
	$html.select(".app p");
log.timeEnd("dew");

log.time("jquery");
for (var i = 0; i < 1000; i++)
	$(".app p");
log.timeEnd("jquery");

// incremental select
log.time("native");
for (var i = 0; i < 1000; i++)
{
    var elem = document.querySelectorAll(".app, .and");
    for (var j = 0; j < elem.length; j++)
        elem[j].querySelectorAll("p, a");
}
log.timeEnd("native");

log.time("dew");
for (var i = 0; i < 1000; i++)
    $html.select(".app, .and").select("p, a");
log.timeEnd("dew");

log.time("jquery");
for (var i = 0; i < 1000; i++)
    $(".app, .and").find("p, a");
log.timeEnd("jquery");
