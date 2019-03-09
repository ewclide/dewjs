let h1 = $html.create('h1').text('Test');
$html.select('.app').append(h1);
$html.select('.other').append(h1);
h1.style('color', 'red');

console.log(h1)
