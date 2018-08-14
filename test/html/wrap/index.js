var h1 = $html.select("h1");

// var wrap = h1.wrap("first-wrap");
var wrap = h1.wrap(["first-wrap", "second-wrap", "third-wrap"]);

log(wrap)