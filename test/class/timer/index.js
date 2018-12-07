const timer = new DEW.Timer({
    // count: 5,
    duration: 500,
    // step: 100,
    action: (e) => console.log(e)
});

timer.start();

setTimeout(() => timer.sleep(1000), 200);
setTimeout(() => timer.sleep(1000), 1100);
