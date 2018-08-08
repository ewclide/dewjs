var jq = $html
	.script("https://code.jquery.com/jquery-3.2.1.min.js")
	.then(function(e){
		log(e, "jquery loaded!");
	});

$html.ready(function(){
	log("dom loaded!");
});

var bigImages = $html.select(".big-images").ready(function(){
	log(false, "imgs ready!")
});

// returns async object, wich can used in other async objects
log(bigImages)