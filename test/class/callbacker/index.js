const cb = new DEW.Callback();

cb.push(function first(v){
	return v + 1;
});
cb.push(v => v + 2);
cb.push(v => v + 3);

log(cb.sequence(2));
log(cb.filter((i,v) => v < 5, 2));
log(cb.call(5));
log(cb.single('first', 10));

/**
results : 8, 3, [6, 7, 8], 11
*/

const a = (x) => new Promise((r) => setTimeout(() => r(x + 1), 1000));
const b = (x) => new Promise((r) => setTimeout(() => r(x + 2), 2000));
const c = (x) => Promise.resolve(x);

const cb2 = new DEW.Callback(a, b, c);

Promise.all(cb2.call(2)).then((e) => log(e, 'completed'));