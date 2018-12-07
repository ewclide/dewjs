var lerp = new DEW.Lerp({
    timing: 'InOutQuad'
});

lerp.onUpdate((e) => console.log(e));

lerp.setState(0, 100).start();
setTimeout(() => lerp.stop(), 100)
setTimeout(() => lerp.start(), 2000)
// lerp.start().then(() => console.log("end"));

async function anim() {
    await lerp.thenState(0, 100);
    await lerp.thenState(100, 50);
    await lerp.sleep(2000);
    await lerp.thenState(50, 150);
}

// anim();
