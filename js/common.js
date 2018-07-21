var hello = $html.create("h1").text("Hello world!");
$html.ready(function(){
	// $html.body.append(hello);
	$html.select(".app").append(hello);
});

/*
var mega = new Dew.MegaFunction();

mega.push(function(data){
	return data + 1;
}, "first");

mega.push(function(data){
	return data + 2;
});

mega.push(function(data){
	return data + 3;
});

log(mega(2, true));
log(mega(5));
log(mega.evoke("first", 10));
*/

/*
var arr = [ "4-5 t", "3-7.5 t", "3", "7-8,5 t", "12 - 20.5 t", "12 - 20 t"];

log(Dew.array(arr).smartSort());

var one = [ "a", "b", "c", "d", "f"],
	two = [ "a", "b", "c", "d", "e"];

log(Dew.array(one).difference(two));
log(Dew.array(one).subtract(two));
log(Dew.array(one).compare(two));
*/
/*
var one = [ "a", "b", "c" ],
	two = [ "c", "d", "e" ];

var sub = Dew.array(one).subtract(two);

log(sub)
*/

/*
class Block
{
	constructor(options)
	{
		var self = this;

		this.settings = {};

		Dew.object(this).init(options, {
			height: { type: "number", required: true, root: self.settings },
			width: {
				type: "number",
				required: true,
				def: 150,
				attr: {
					element: options.element,
					only: true
				},
				filter: function(value) {
					return value * 2;
				}
			}
		}, {
			errors : true
		});
	}
}

class Block2
{
	constructor(options)
	{
		this.settings = {};

		Dew.object(this).init(options, {
			width  : 100,
			height : 200,
			length : 300,
			count  : 400
		},
		{
			// required : true,
			type   : "number",
			root   : this.settings,
			errors : true,
			attr   : {
				element : options.element
			}
		});
	}
}

$html.ready(function(){

log.time()
	var block = new Block({
		element : "#root",
		height : 250
	});
log.timeEnd()

log.time()
	var block2 = new Block2({
		element : "#root",
		// length : 300,
		// count  : 400
	});
log.timeEnd()

log(block, block2)

})
*/

/*
var info = {
	template : '<div class="info-block">'+
		'<p><b>{name}</b> : {test} <span>{age}</span></p>'+
		'{node[1]}'+
	'</div>',
	content : {
		name : "name",
		age : "age"
	},
	nodes : {
		tag : "input",
		attrs : { type : "text" }
	}
}

var form = {
	tag : "form",
	attrs : {
		action : "/"
	}
}

var nameInput = {
	tag : "input",
	value : "def",
	attrs : {
		type : "text",
		name : "name"
	},
	events : {
		input : function(e)
		{
			info.content.name = nameInput.value;
		}
	},
	bind : [ "value", "transform" ]
}

var ageInput = Dew.object(nameInput).clone(true);
	ageInput.attrs.name = "age";
	ageInput.events = {
		input : function(e)
		{
			info.content.age = ageInput.value;
		}
	}

form.nodes = [nameInput, ageInput];

$html.ready(function(){

log.time();
	$html.select(".app").jsonAppend(form);
	$html.select(".app").jsonAppend(info);
log.timeEnd()

});
*/

/*
$html.ready(function(){

	var quad = $html.select(".quad");
	var circle = $html.select(".circle");

	circle.transform({
		rotate : [45, 0 , 0]
	});

	var trans = quad.transform();

	trans.apply({
		// matrix3d : [0.583333, 0.186887, 0.79044, 0, -0.52022, 0.833333, 0.186887, 0, -0.623773, -0.52022, 0.583333, 0, 0, 0, 0, 1],
		rotate : [0, 45, 0],
		translate : [0, 0],
		settings : {
			perspective : 500,
			style : "3d",
			transition : 2000
		}
	});

	log(trans)

});
*/

/*
class Loader extends Dew.Async
{
	constructor(bar)
	{
		super();

		var imgList = [];

		imgList.push(Dew.http.get('/assets/big.bmp', { progress : true }));
		imgList.push(Dew.http.get('/assets/big.bmp', { progress : true }));

		this.progress(function(e){
			log(e)
			bar.transform({
				scale : e.ready
			})
		});

		this.wait(imgList, true).then(function(){
			log("loaded!")
		});
	}
}

$html.ready(function(){

	var bar = $html.create("div", "loadbar");
		bar.css({
			height : "5px",
			width  : "100%",
			background : "#0070ff",
			transition : "500ms"
		})
		bar.transform({
			scale : 0.01,
			settings : {
				origin : [0, 0]
			}
		})

	$html.body.append(bar);

	var loader = new Loader(bar);
});
*/

// Dew.url.setParams({ t : 2, s : "test" });

/*
var info = {
	names : ["max", "alex", "serj"],
	title : "names-list"
};

var template = `<h2><& :=title &></h2>
<ul class='names-list'>
<& names.forEach( name => { &>
	<li class="item"><& :=name &></li>
<& }) &>
<& //echo(names) &>
</ul>`;

// log.time()
var tpl = new Dew.Template(template, ["title", "names"]);
// log.timeEnd()

var input = $html.create("input", { type : "text" }),
	add = $html.create("button").text("add")
	.eventAttach("click", function(e){
		var value = input.value();
		if (value && !Dew.array(info.names).have(value))
		{
			info.names.push(input.value());
			input.value("");
			tpl.draw(info);
		}
	});

$html.ready(function(){
	log.time()
	$html.select(".app").tplAppend(tpl).draw(info);
	$html.select("#in").append(input);
	$html.select("#in").append(add);
	// tpl.appendTo(".app").draw(info);
	log.timeEnd()
});
*/

/*
var jq = $html.script("https://code.jquery.com/jquery-3.2.1.min.js")
	.ready(function(){
		log("jquery loaded!");
		// $(".imload").css("background", "red");
	});

$html.ready(function(){
	log("dom loaded!");
});*/

/*
var list = {
	obj : { a : "A", b : "B", c : "C" },
	arr : [ 1, 2, 3, 4, 5 ],
}

var full = Dew.object(list).clone(true),
	simple = Dew.object(list).clone();

list.obj.b = "changed B"

log(full)
log(simple)
*/

/*
var defaults = {
		width : 100,
		height: 100,
		count : 5,
		color : "red"
	}

	class Some
	{
		constructor(settings)
		{
			this.settings = Dew.object(defaults).joinLeft(settings, true);
		}
	}

	var some = new Some({
		width : 200,
		height: 200,
		other : "other"
	});

	log(some)
	log(defaults)
*/

/*
var defaults = {
		width : 100,
		height: 100,
		count : 5,
		color : "red"
	}

class Some
{
	constructor(settings)
	{
		this.settings = Dew.object(settings).joinRight(defaults);
	}
}

var some = new Some({
	width : 200,
	height: 200,
	other : "other"
});

log(some)
log(defaults)
*/

/*
var panel = {
	width : 250,
	height: 100,
	get area()
	{
		return this.width * this.height;
	}
}

var ring = {
	radius : 50,
	get diameter()
	{
		return this.radius * 2;
	},
	get length()
	{
		return 2 * Math.PI * this.radius;
	}
}

var form = Dew.object(panel).joinFull(ring, true);

log(form)
*/

/* need to add */
/*

2. $html.mutation update
   $html.append(array)

3. animation

4. Async refresh

*/

