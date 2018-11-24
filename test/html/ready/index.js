let jq = $html
	.script("https://code.jquery.com/jquery-3.2.1.min.js")
	.then(function(e){
		log("jquery loaded!");
	})
    .except(function(e){
        DEW.printErr(e);
    });

$html.ready(function(){
	log("dom loaded!");
});

let bigImages = $html.select(".big-images").ready(function(){
	log("Images ready!")
});

bigImages.except((e) => log(e));