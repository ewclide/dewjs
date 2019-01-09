const cascad = $html.cascad();

const fade = cascad.addKeyFrames('fade', [
    { opacity: 0 },
    { opacity: 1 }
]);

cascad.add('.test', {
    animation: 'fade 3s'
});

cascad.media({
    screen: true,
    maxWidth: 768
}, [
    {
        rule: '.test',
        animation: 'fade 0.5s'
    }
]);

// cascad.remove(fade);

const h1 = $html.create('h1', 'test').text('Test');
$html.body.append(h1);

console.log(cascad)