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
				filter: function filter(value) {
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
theAge.events = {
	input : function(e)
	{
		info.content.age = theAge.value;
	}
}
theAge.attrs.name = "age";

form.nodes = [theName, theAge];

DOC.ready(function(){

	DOC.select(".app").json.append(form);
	DOC.select(".app").json.append(info);

});*/

/*$html.ready(function(){

var quad = $html.select(".quad");
var circle = $html.select(".circle");

circle.transform({
	rotate : [45, 0 , 0]
});

var trans = quad.transform();

trans.apply({
	rotate : [0, 45, 0],
	translate : [0, 0],
	settings : {
		perspective : 500,
		style : "3d",
		transition : 2000
	}
});

setTimeout(function(){
	trans.apply({
		rotate : [0, 70, 0]
	})
	.then(function(){
		trans.apply({
			rotate : [0, 100, 0]
		})
	});
}, 1000);

log(trans)

});*/

class Test extends $Async
{
	constructor(bar)
	{
		super();

		var some = $http.get('/assets/bigimage.bmp'),
			some2 = $http.get('/assets/test.json');

		some.on.progress(function(e){
			bar.transform({
				scale : e.relation
			})
		});

		this.wait([some, some2]).then(function(){
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
			scale : 0,
			settings : {
				transition : 50,
				origin : [0, 0]
			}
		})


	$html.body.append(loadBar);

	var test = new Test(loadBar);

});