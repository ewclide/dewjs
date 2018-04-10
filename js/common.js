'use strict';

/*class Block
{
	constructor(options)
	{
		var self = this;

		this.settings = {};

		this.$init({
			height: { type: "number", required: true, root: self.settings },
			width: {
				type: "number",
				required: true,
				def: 150,
				attr: {
					element: options.element,
					prefix: "data-",
					only: true
				},
				filter: function(value) {
					return value * 2;
				}
			}
		}, options, true);
	}
};*/

/*var info = {
	template : "<p><b>{name}</b> : {test}<span>{age}</span></p>",
	content : {
		name : "name",
		age : "age"
	}
}

var form = {
	tag : "form",
	attrs : {
		action : "/"
	}
}

var theName = {
	tag : "input",
	value : "def",
	attrs : {
		type : "text",
		name : "name"
	},
	events : {
		input : function(e)
		{
			info.content.name = theName.value;
		}
	},
	bind : [ "value", "transform" ]
}

var theAge = theName.$clone(true);
	theAge.attrs.name = "age";
	theAge.events = {
		input : function(e)
		{
			info.content.age = theAge.value;
		}
	}

form.nodes = [theName, theAge];

$html.ready(function(){

	$html.select(".app").json.append(form);
	$html.select(".app").json.append(info);

});*/

/*$html.ready(function(){

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

});*/

/*class Test extends $Async
{
	constructor(bar)
	{
		super();

		var some = $http.get('/assets/bigimage.bmp', { progress : false }),
			some2 = $http.get('/assets/bigimage.bmp', { progress : false }),
			some3 = $http.get('/assets/bigimage.bmp', { progress : false }),
			some4 = $http.get('/assets/bigimage.bmp', { progress : false })

		this.on.progress(function(e){
			bar.transform({
				scale : e.ready
			})
		});

		this.wait([some, some2, some3, some4]).then(function(){
			log("loaded!")
		});
	}
}

$html.ready(function(){

	var loadBar = $html.create("div", "loadbar");
		loadBar.css({
			height : "5px",
			width  : "100%",
			background : "#0070ff"
		})
		loadBar.transform({
			scale : 0.01,
			settings : {
				transition : 500,
				origin : [0, 0]
			}
		})

	$html.body.append(loadBar);

	var test = new Test(loadBar);

});*/

$url.setParams({ t : 2, s : "test" });