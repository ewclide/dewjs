let main  = new Dew.Async(),
    one   = new Dew.Async(),
    two   = new Dew.Async(),
    three = new Dew.Async(),
    other = new Dew.Async();

three.except(function(e){
    log(e)
    log("three rejected!");
});

three.wait(other);

setTimeout(function(){
    one.resolve();
}, 1000);

setTimeout(function(){
    two.resolve();
}, 2000);

setTimeout(function(){
    other.reject("other rejected!");
    // other.resolve();
}, 1500);

main.wait([one, two, three])
.then(function(){
    log("main resolved!");
})
.except(function(e){
    log("main rejected!");
    Dew.printErr(e);
});