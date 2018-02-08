var defaults = {
	units : {
		perspective : "px",
		translate : "px",
		rotate : "deg",
		skew : "deg",
		origin : "%",
		transition : "ms"
	},
	actions : {
		matrix2d : [], // need add support
		matrix3d : [], // need add support
		translate : [0, 0, 0],
		rotate : [0, 0, 0],
		scale : [1, 1],
		skew : [0, 0]
	},
	settings : {
		origin : false,
		transition : 0,
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
		this._actions = defaults.actions.$clone(true);
		this._units = defaults.units.$clone();
		this._settings = defaults.settings.$clone();
		this._callback;
		this.completed = false;

		this.element.event.attach({
			"transitionend" : function()
			{
	        	if (self._callback)
	        	{
	        		self._callback();
	        		self._callback = null;
	        	}
	        	self.completed = true;
        	}
    	});
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

        if (settings.transition)
            this.element.css({ "transition" : settings.transition + units.transition });

        if (settings.origin)
            this.element.css({ "transform-origin" : settings.origin[0] + units.origin + " " + settings.origin[1] + units.origin });

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

	then(fn)
	{
		if (this.completed) fn();
		else this._callback = fn;
	}

	actions(data)
	{
		var actions = this._actions;

		if (data.reset) this.reset.actions();

		if (data.translate) actions.translate = this._join(actions.translate, data.translate);
		if (data.rotate)    actions.rotate = this._join(actions.rotate, data.rotate);
		if (data.scale)     actions.scale = this._join(actions.scale, data.scale, true);
		if (data.skew)      actions.skew = this._join(actions.skew, data.skew);
	}

	units(data)
	{
		if (data.reset) this.reset.units();
		if (data) this._units.$join.left(data);
	}

	settings(data)
	{
		var settings = this._settings;

		if (data.transition && typeof data.transition == "number")
			settings.transition = data.transition;

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

	get reset()
	{
		var self = this;

		return {
			units : function()
			{
				this._units = defaults.units.$clone();
			},
			actions : function()
			{
				this._actions = defaults.actions.$clone(true);
			},
			settings : function()
			{
				this._settings = defaults.settings.$clone();
			},
			full : function()
			{
				this._actions = defaults.actions.$clone(true);
				this._units = defaults.units.$clone();
				this._settings = defaults.settings.$clone();
			}
		}
	}

	_build(actions, units)
	{
		var result = "";

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

            if (result) result += " ";
        }

        return result;
	}

	_empty(array, char = 0)
	{
		var result = array.filter(function(item){
			if (item === char) return false;
			else return true;
		});

		if (!result.length) return true;
		else return false;
	}
}