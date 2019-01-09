const cascad = $html.cascad();
cascad.addKeyFrames('fade', [
    { opacity: 0 },
    { opacity: 1 }
]);
cascad.add('.test', {
    animation: 'fade 2s'
});

const h1 = $html.create('h1', 'test').text('Test');
$html.body.append(h1);