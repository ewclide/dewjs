var h1 = $html.select("h1").style("color", "red");
$html.select(".text-block")
.style({
	display : "inline-block",
	background : "#ebebeb",
	color : "red",
	padding : "20px",
	marginTop : "10px"
})

log(h1.style("color"))