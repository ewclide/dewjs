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

DOC.ready(function(){

	var info = {
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

	var name = {
		tag : "input",
		value : "def",
		attrs : {
			type : "text",
			name : "name"
		},
		events : {
			input : function(e)
			{
				info.content.name = name.value;
			}
		},
		bind : [ "value", "transform" ]
	}

	var age = name.$clone(true);
		age.events = {
			input : function(e)
			{
				info.content.age = age.value;
			}
		}

		age.attrs.name = "age";

		log(age)

	form.nodes = [name, age]

	DOC.select(".app").json.append(form);
	DOC.select(".app").json.append(info);

});

