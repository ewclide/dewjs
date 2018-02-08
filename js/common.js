'use strict';

// class Block
// {
// 	constructor(options)
// 	{
// 		var self = this;

// 		this.settings = {};

// 		this.$init({
// 			height: { type: "number", required: true, root: self.settings },
// 			width: {
// 				type: "number",
// 				required: true,
// 				def: 150,
// 				attr: {
// 					element: options.element,
// 					prefix: "data-",
// 					only: true
// 				},
// 				filter: function filter(value) {
// 					return value * 2;
// 				}
// 			}
// 		}, options, true);
// 	}
// };


// var info = {
// 	template : "<p><b>{name}</b> : {test}<span>{age}</span></p>",
// 	content : {
// 		name : "name",
// 		age : "age"
// 	}
// }

// var form = {
// 	tag : "form",
// 	attrs : {
// 		action : "/"
// 	}
// }

// var theName = {
// 	tag : "input",
// 	value : "def",
// 	attrs : {
// 		type : "text",
// 		name : "name"
// 	},
// 	events : {
// 		input : function(e)
// 		{
// 			info.content.name = theName.value;
// 		}
// 	},
// 	bind : [ "value", "transform" ]
// }

// var theAge = theName.$clone(true);
// theAge.events = {
// 	input : function(e)
// 	{
// 		info.content.age = theAge.value;
// 	}
// }
// theAge.attrs.name = "age";

// form.nodes = [theName, theAge];

// DOC.ready(function(){

// 	DOC.select(".app").json.append(form);
// 	DOC.select(".app").json.append(info);

// });

$html.select(".app").append($html.create("div", "asdad"));

$html.ready(function(){

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

});

/*-------------need updates------------*/
//update $join - add left, right and full join
