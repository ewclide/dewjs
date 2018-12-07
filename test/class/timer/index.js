const timer = new DEW.Timer2({
    // count: 5,
    duration: 1000,
    step: 100,
    action: (e) => console.log(e)
});

timer.start();

setTimeout(() => timer.sleepSync(1000), 200);
// setTimeout(() => timer.sleepSync(1000), 1000);
