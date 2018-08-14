var h1 = $html.select("h1").style("color", "red");
$html.select(".text-block")
.style({
	display : "inline-block",
	background : "#ebebeb",
	color : "red",
	padding : "20px",
	marginTop : "10px"
})

var elemNative = document.querySelectorAll(".test");
log.time("native");
for (var i = 0; i < 1000; i++)
	for (var j = 0; j < elemNative.length; j++)
    	elemNative[j].style.background = "red";
log.timeEnd("native");

var elemDew = $html.select(".test");
log.time("dew");
for (var i = 0; i < 1000; i++)
    elemDew.style("background", "red");
log.timeEnd("dew");

var elemJquery = $(".test");
log.time("jquery");
for (var i = 0; i < 1000; i++)
    elemJquery.css("background", "red");
log.timeEnd("jquery");

log(h1.style("color"))