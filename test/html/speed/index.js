log.time("native");
for (var i = 0; i < 1000; i++)
    var htl = document.querySelectorAll(".app p");
log.timeEnd("native");

log.time("dew");
for (var i = 0; i < 1000; i++)
	var htl = $html.select(".app p");
log.timeEnd("dew");

log.time("jquery");
for (var i = 0; i < 1000; i++)
	var htl = $(".app p");
log.timeEnd("jquery");

// incremental select
log.time("native");
for (var i = 0; i < 1000; i++)
    var htl = document.querySelectorAll(".app p, .app a, .and p, .and a");
log.timeEnd("native");

log.time("dew");
for (var i = 0; i < 1000; i++)
    var htl = $html.select(".app, .and").select("p, a");
log.timeEnd("dew");

log.time("jquery");
for (var i = 0; i < 1000; i++)
    var htl = $(".app, .and").find("p, a");
log.timeEnd("jquery");
