var mega = new Dew.MegaFunction();

mega.push(function(data){
	return data + 1;
}, "first");

mega.push(function(data){
	return data + 2;
});

mega.push(function(data){
	return data + 3;
});

log(mega(2, true));
log(mega(5));
log(mega.evoke("first", 10));
