const button = $html.create('button').text('click me!');
button.addEvent('click', (e) => {
    console.log(e)
});

button.fireEvent('click');

$html.body.append(button);