let h1 = $html.select("h1");
let attrs = h1.getAttr();
log(attrs)
h1.setAttr("data-new", "new");
h1.unsetAttr();