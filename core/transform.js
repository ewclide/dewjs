import {objectExtends} from './object';

var defaults = {
	units : {
		perspective : "px",
		translate : "px",
		rotate : "deg",
		skew : "deg",
		origin : "%"
	},
	actions : {
		matrix2d : [],
		matrix3d : [],
		translate : [0, 0, 0],
		rotate : [0, 0, 0],
		scale : [1, 1],
		skew : [0, 0]
	},
	settings : {
		origin : false,
		perspective : 0,
		style : false,
		backface : true
	}
}

export class Transform
{
	constructor(element)
	{
		var self = this;

		this.element = element;
		this._actions = objectExtends.clone(defaults.actions, true);
		this._units = objectExtends.clone(defaults.units);
		this._settings = objectExtends.clone(defaults.settings);
	}

	apply(data)
	{
		if (data)
		{
			this.actions(data);
			if (data.settings) this.settings(data.settings);
			if (data.units) this.units(data.units);
		}

		var units = this._units,
			actions = this._actions,
			settings = this._settings,
			transform = "";

        if (settings.origin)
            this.element.css({
            	"transform-origin" : settings.origin[0] + units.origin + " " + settings.origin[1] + units.origin
            });

        if (!settings.backface)
            this.element.css({ "backface-visibility" : "hidden" });

        if (settings.style)
        {
            if (settings.style == "3d")
                this.element.css({ "transform-style" : "preserve-3d" });

            else if (settings.style == "flat")
                this.element.css({ "transform-style" : "flat" });
        }

        if (settings.perspective)
            transform += "perspective(" + settings.perspective + units.perspective + ") ";

        this.completed = false;
        this.element.css({ "transform" : transform + this._build(actions, units) });

        return this;
	}

	actions(data)
	{
		var actions = this._actions;

		if (data.reset) this.reset.actions();

		if (data.translate) actions.translate = this._join(actions.translate, data.translate);
		if (data.rotate)    actions.rotate = this._join(actions.rotate, data.rotate);
		if (data.scale)     actions.scale = this._join(actions.scale, data.scale, true);
		if (data.skew)      actions.skew = this._join(actions.skew, data.skew);
		if (data.matrix2d)  actions.matrix2d = data.matrix2d;
		if (data.matrix3d)  actions.matrix3d = data.matrix3d;
	}

	units(data)
	{
		if (data.reset) this.reset.units();
		if (data) objectExtends.joinLeft(this._units, data);
	}

	settings(data)
	{
		var settings = this._settings;

		if (data.origin && data.origin.length == 2)
			settings.origin = data.origin;

		if (data.backface !== undefined)
			settings.backface = data.backface;

		if (data.style)
			settings.style = data.style;

		if (data.perspective && typeof data.perspective == "number")
			settings.perspective = data.perspective;
	}

	_join(left, right, mul = false)
	{
		var arr = [];

		right = arr.concat(right);

		return left.map(function(item, index){
			var add = +right[index];
			if (add) return mul ? item * add : item + add;
			else return item;
		});
	}

	reset()
	{
		this._actions = objectExtends.clone(defaults.actions, true);
		this._units = objectExtends.clone(defaults.units);
		this._settings = objectExtends.clone(defaults.settings);
	}

	resetUnits()
	{
		this._units = objectExtends.clone(defaults.units);
	}

	resetActions()
	{
		this._actions = objectExtends.clone(defaults.actions, true);
	}

	resetSettings()
	{
		this._settings = objectExtends.clone(defaults.settings);
	}

	_build(actions, units)
	{
		var result = "";

		if (actions.matrix2d.length || actions.matrix3d.length)
		{
			if (actions.matrix2d.length) result += "matrix2d(" + actions.matrix2d.join(",") + ") ";
            else if (actions.matrix3d.length) result += "matrix3d(" + actions.matrix3d.join(",") + ") ";
		}
		else
		{
	        for (var name in actions)
	        {
	            var action = actions[name],
	                unit = units[name] || "";

	            switch (name)
	            {
	                case "translate" :
	                	if (!this._empty(action))
	                		result += "translate3d(" + action.join(unit + ",") + unit + ") ";
	                	break;
	                case "rotate" :
		                if (action[0]) result += "rotateX(" + action[0] + unit + ") ";
		                if (action[1]) result += "rotateY(" + action[1] + unit + ") ";
		                if (action[2]) result += "rotateZ(" + action[2] + unit + ") ";
	                    break;
	                case "scale":
	                	if (!this._empty(action, 1))
	                		result += "scale(" + action.join() +  ") ";
	                	break;
	                case "skew" :
	                	if (!this._empty(action))
	                		result += "skew(" + action.join(unit + ",") + unit + ") ";
	                	break;
	            }
	        }
	    }

        return result;
	}

	_empty(array, char = 0)
	{
		var result = array.filter( item => item === char ? false : true );
		
		return !result.length ? true : false;
	}
}