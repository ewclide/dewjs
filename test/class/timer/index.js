const timer = new DEW.Timer({
    // count: 5,
    duration: 500,
    flow: 0.5,
    // step: 100,
    action: (dt, elapsed) => console.log(dt, elapsed)
});

timer.play();

setTimeout(() => {
    timer.sleep(1000);
    console.log('sleep')
}, 200);
// setTimeout(() => timer.sleep(1000), 1100);
