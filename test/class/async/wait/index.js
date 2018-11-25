let main  = new DEW.Async(),
    one   = new DEW.Async(),
    two   = new DEW.Async(),
    three = new DEW.Async(),
    other = new DEW.Async();

three.catch((e) => log("three rejected!"));

three.wait(other);
setTimeout(() => other.reject("other rejected!"), 1500);

setTimeout(() => one.resolve(), 1000);
setTimeout(() => two.resolve(), 2000);
// setTimeout(() => three.resolve(), 1000);

main.wait([one, two, three])
.then(() => log("main resolved!"))
.catch((e) => {
    log("main rejected!");
    DEW.printErr(e);
});