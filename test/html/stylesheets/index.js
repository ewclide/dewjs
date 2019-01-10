const cascad = $html.cascad();

const fade = cascad.keyFrames('fade', [
    { opacity: 0 },
    { opacity: 1 }
]);

cascad.add('.test', {
    animation: 'fade 5s'
});

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
$html.body.append(h1);

console.log(cascad, media)
