const { html } = DEW;
const { Clock, Time } = DEW.clock;

const clock = new Clock({
    // count: 5,
    duration: 2,
    timeScale: 0.5,
    // step: 100,
    onUpdate: (dt, elapsed) => {
        console.log(dt, elapsed);
    }
});

// clock.play();

// setTimeout(() => {
//     clock.sleep(1);
//     console.log('sleep');
// }, 1000);

// setTimeout(() => clock.sleep(1000), 1100);

const duration = 140;
const p = html.create('p');
p.styles({
    fontSize: '50px',
    fontFamily: 'Consolas',
    fontWeight: 'bold',
    margin: 0,
    padding: '15px'
})
.appendTo(html.body);

const pClock = new Clock({
    duration,
    step: 1,
    onUpdate: (dt, elapsed) => {
        t = Time.parse(duration - elapsed);
        p.text(`${t[0]}:${t[1]}:${t[2]}`);
    },
    onFinish: () => {
        p.text('Lets go!')
    }
});

pClock.play();
