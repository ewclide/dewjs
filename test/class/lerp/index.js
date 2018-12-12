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
}).appendTo($html.body)

// const clones = [];

// for (let i = 0; i < 100; i++) {
//     let clone = box.clone().style('top', i * 70 + 'px');
//     clones.push(clone);
//     $html.body.append(clone);
// }

// box.join(clones);

// console.log(box)

async function animate(box) {
    lerp.action((offset) => box.translate(offset));
    await lerp.run(0, 500, 1000, 'linear');
    await lerp.run(500, 250, 500, 'InOutQuad');
    await lerp.sleep(1000);
    await lerp.run(250, 700, 1500);
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
