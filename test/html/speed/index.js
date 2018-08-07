log.time();
for (var i = 0; i < 1000; i++)
    var htl = document.querySelectorAll(".app p");
log.timeEnd();

log.time();
for (var i = 0; i < 1000; i++)
	var htl = $html.select(".app p");
log.timeEnd();

log.time();
for (var i = 0; i < 1000; i++)
	var htl = $(".app p");
log.timeEnd();

// incremental select
log.time();
for (var i = 0; i < 1000; i++)
    var htl = document.querySelectorAll(".app p, .app a, .and p, .and a");
log.timeEnd();

log.time();
for (var i = 0; i < 1000; i++)
    var htl = $html.select(".app, .and").select("p, a");
log.timeEnd();

log.time();
for (var i = 0; i < 1000; i++)
    var htl = $(".app, .and").find("p, a");
log.timeEnd();
