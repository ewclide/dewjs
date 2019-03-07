const cascad = $html.createStyleSheet();

const fade = cascad.keyFrames('fade', [
    { opacity: 0 },
    { opacity: 1 }
]);

cascad.add('.test', {
    animation: 'fade 5s'
});

const anim = cascad.animation()
.then({
    fillMode: 'forwards',
    duration: 2000
}, [
    { opacity: 0 },
    { opacity: 1 }
])
.then({
    fillMode: 'forwards'
}, [
    { color: 'black' },
    { color: 'red' }
])
.and({
    fillMode: 'forwards'
}, [
    { fontSize: '24px' },
    { fontSize: '32px' }
])
.then({
    fillMode: 'forwards',
    delay: 1000
}, [
    { color: 'red' },
    { color: 'blue' }
])
.init();

console.log(anim)

const media = cascad.media({
    screen: true,
    maxWidth: 768,
    minWidth: 320
},[
    {
        rule: '.test',
        animation: 'fade 0.5s'
    }
]);

// const mTest = media.add('.test', {
//     animation: 'fade 0.5s'
// });
// media.remove(mTest);
// media.clear();

// cascad.remove(fade);
// cascad.remove(media);

const h1 = $html.create('h1', 'test').text('Test');
const h2 = $html.create('h2', anim.className).text('Test');
$html.body.append([h1, h2]);
