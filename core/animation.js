export class Animation
{
	constructor(element)
	{
		var self = this;

		this.element = element;
		this._keyFrames = [];
		this._stop = false;
		this._currentKeyFrame = 0;
		this.element.event.attach("transitionend", function(){
			if (!self._stop)
			{
				self._currentKeyFrame++;
				self._keyFrames[self._currentKeyFrame].apply();
			}
        });
	}

	play()
	{
		this._keyFrames[this._currentKeyFrame].apply();
	}

	stop()
	{
		this._stop = true;
	}

	reset()
	{
		this._stop = true;
		this._currentKeyFrame = 0;
	}

	finish()
	{
		this._stop = true;
		this._currentKeyFrame = this._keyFrames.length;
		this._keyFrames[this._currentKeyFrame].apply();
	}

	keys(keys, settings)
	{
		var self = this;

		if (Array.isArray(keys))
			keys.forEach(function(key){
				var keyFrame = new KeyFrame(self.elements, key, settings);
				self._keyFrames.push(keyFrame);
			});

		else
		{
			var keyFrame = new KeyFrame(self.elements, keys, settings);
				this._keyFrames.push(keyFrame);
		}
	}

	setup(data)
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
}

class KeyFrame
{
	constructor(element, keys, settings)
	{
		this.element = element;

		// this.transform = element.transform();
		// this.transKeys = keys.transform;
		// 				 keys.transform = undefined;

		this.keys = keys;
		this.settings = settings;
	}

	apply()
	{
		// if (this.transKeys)
		// 	this.transform.apply(this.transKeys);

		this.element.css(this.keys);
	}
}

