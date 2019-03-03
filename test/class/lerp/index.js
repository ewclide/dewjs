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
    lerp.addAction((offset) => box.translate(offset));
    await lerp.run(0, 500, 1, 'linear');
    await lerp.run(500, 250, 0.5, 'InOutQuad');
    await lerp.sleep(1);
    await lerp.run(250, 700, 1.5);
}

animate(box);