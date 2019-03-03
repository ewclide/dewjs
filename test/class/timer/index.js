const timer = new DEW.Timer({
    // count: 5,
    duration: 2,
    flow: 0.5,
    // step: 100,
    onUpdate: (dt, elapsed) => {
        console.log(dt, elapsed);
    }
});

// timer.play();

// setTimeout(() => {
//     timer.sleep(1);
//     console.log('sleep')
// }, 1000);
// setTimeout(() => timer.sleep(1000), 1100);

const p = $html.create('p');
p.styles({
    fontSize: '50px',
    fontFamily: 'Consolas',
    fontWeight: 'bold',
    margin: 0,
    padding: '15px'
})
$html.body.append(p);

const ptime = new DEW.Timer({
    duration: 140,
    step: 1,
    onUpdate: (dt, elapsed) => {
        t = DEW.Timer.parse(140 - elapsed);
        p.text(`${t[0]}:${t[1]}:${t[2]}`);
    },
    onFinish: () => {
        p.text('Lets go!')
    }
});

ptime.play();
