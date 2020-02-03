const { html } = Dew.common;

const h1 = html.select("h1");
const attrs = h1.getAttr();

log(attrs)

h1.setAttr("data-new", "new");
h1.unsetAttr();