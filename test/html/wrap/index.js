let h1 = $html.select("h1");

// let wrap = h1.wrap("first-wrap");
let wrap = h1.wrap(["first-wrap", "second-wrap", "third-wrap"]);

log(wrap)