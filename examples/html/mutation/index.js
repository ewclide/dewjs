const { html } = Dew.common;

const h1 = html.select('h1');

h1.mutate((e) => log('callback', e), { attributes : true });
h1.mutateDisable();
h1.mutateEnable();

// h1.mutate((e) => log('another callback', e));
const h1Spec = html.select('#spec');
h1Spec.onResize((s) => console.log(s));
h1Spec.onResize((s) => console.log(s));
// h1.clearOnResize();
// h1.setAttr('data-test', 'test');
// h1Spec.setAttr('data-new', 'new');

h1.style('font-size', '50px');
setTimeout(() => h1.style('color', 'red'), 1000);