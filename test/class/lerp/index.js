var lerp = new DEW.Lerp({
    timing: 'InOutQuad'
});

var box = $html.create('div').styles({
    position: "absolute",
    top: '50px',
    left: '50px',
    width: '50px',
    height: '50px',
    background: 'red',
    borderRadius: '50%'
});

for (let i = 0; i < 1000; i++) {
    $html.body.append(box, true);
}
    

async function animate(box) {
    lerp.onUpdate((offset) => box.style('transform', `translateX(${offset}px)`));
    await lerp.thenState(0, 500, 1000);
    await lerp.thenState(500, 250, 500);
    await lerp.sleep(1000);
    await lerp.thenState(250, 700, 1500);
}

animate(box);

// lerp.action((e) => console.log(e));

// lerp.setState(0, 100).start();
// setTimeout(() => lerp.stop(), 100)
// setTimeout(() => lerp.start(), 2000)
// lerp.start().then(() => console.log("end"));

// async function anim() {
//     await lerp.thenState(0, 100);
//     await lerp.thenState(100, 50);
//     await lerp.sleep(2000);
//     await lerp.thenState(50, 150);
// }

// anim();
