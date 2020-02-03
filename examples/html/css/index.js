const { html } = Dew.common;

const h1 = html.select('h1').style('color', 'red');

html.select('.text-block')
	.styles({
		display : 'inline-block',
		background : '#ebebeb',
		color : 'red',
		padding : '20px',
		marginTop : '10px'
	})
	.styles('border', {
		bottom: '2px solid red',
		top: '1px solid blue'
	});

log(h1.style('color'))