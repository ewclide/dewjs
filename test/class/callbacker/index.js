const cb = new DEW.CallBacker();

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
results : 8, 3, 5, 11
*/
