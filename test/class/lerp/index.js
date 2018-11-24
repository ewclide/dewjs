var lerp = new DEW.Lerp({
    timing : 'InOutQuad'
});

lerp.onUpdate((s) => console.log(s));

// lerp.setState(0, 100)
// lerp.start().then(() => console.log("end"));

// lerp.setState(0, 100);

// async function anim()
// {
//     await lerp.thenState(0, 100);
//     await lerp.thenState(100, 50);
//     await lerp.thenState(50, 150);
// }

// anim();
