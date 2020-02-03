const { html } = Dew.common;

const h1 = html.select("h1");
// const wrap = h1.wrap("first-wrap");
const wrap = h1.wrap(["first-wrap", "second-wrap", "third-wrap"]);

log(wrap)