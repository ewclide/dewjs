var box = $html.create('div', 'loadbar')
.styles({
    height: '50px',
    width: '50px',
    background: '#0070ff',
    // transition: '500ms'
});

$html.body.append(box);

// box.origin([0, 0]).scaleX(2);
box.transform([
    {
        scaleY: 2,
        rotate: 45,
        translate: [15, 0],
        units: {
            translate: 'vmin'
        }
    },
    { rotate: 45 }
], {
    perspective: 500
});