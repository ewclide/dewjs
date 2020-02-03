const { html } = Dew.common;

const p = html.select(".app, .and").select("p, a");
log(p)

const single = html.select(".single");
log(single)