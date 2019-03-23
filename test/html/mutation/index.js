let h1 = $html.select('h1');

h1.mutate((e) => log('callback', e), { attributes : true });

h1.mutateDisable();
h1.mutateEnable();

// h1.mutate((e) => log('another callback', e));

h1.onResize((w, h) => console.log(w, h));
// h1.clearOnResize();

// h1.setAttr('data-test', 'test');
const h1Spec = $html.select('#spec');
// h1Spec.setAttr('data-new', 'new');
h1.style('font-size', '50px');