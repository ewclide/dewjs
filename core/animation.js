export class Animation
{
	constructor($element)
	{
		var self = this;

		this.$element = $element;
		this._keyFrames = [];
		this._stop = false;
		this._currentKeyFrame = 0;
		this.$element.eventAttach("transitionend", function(){
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
		if (Array.isArray(keys))
			keys.forEach( key => {
				var keyFrame = new KeyFrame(this.elements, key, settings);
				this._keyFrames.push(keyFrame);
			});

		else
		{
			var keyFrame = new KeyFrame(this.elements, keys, settings);
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
	constructor($element, keys, settings)
	{
		this.$element = $element;
		this.keys = keys;
		this.settings = settings;
	}

	apply()
	{

	}
}

