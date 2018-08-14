var h1 = $html.select("h1");

h1.mutation(function(e){
	log("callback", e)
}, {
	attributes : true
});

h1.mutationEnd();
h1.mutationStart();

h1.mutation(function(e){
	log("another callback", e)
}, {
	attributes : true
});

// h1.setAttr("data-test", "test");
$html.select("#first").setAttr("data-new", "new");