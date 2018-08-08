var jq = $html
	.script("https://code.jquery.com/jquery-3.2.1.min.js_")
	.then(function(e){
		log("jquery loaded!");
	})
    .except(function(e){
        Dew.printErr(e);
    });

$html.ready(function(){
	log("dom loaded!");
});

var bigImages = $html.select(".big-images").ready(function(){
	log("imgs ready!")
});

// returns async object, wich can used in other async objects
log(bigImages)