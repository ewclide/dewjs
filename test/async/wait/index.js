let main  = new DEW.AsyncExt(),
    one   = new DEW.AsyncExt(),
    two   = new DEW.AsyncExt(),
    three = new DEW.AsyncExt(),
    other = new DEW.AsyncExt();

// three.strict = true;
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