let mega = new Dew.MegaFunction();

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

log(mega(2, true, function(data, idx){
    return data < 5;
}));

log(mega(5));

log(mega.invoke("first", 10));

/**
results : 8, 5, 5, 11
*/
