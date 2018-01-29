Array.prototype.$define({
	$have : function(value)
	{
		var index = this.indexOf(value);
		if (index == -1) return false;
		else return { index : index }
	},
	$remove : function(options)
	{
		var index = options.index;

		if (options.value != undefined)
			index = this.indexOf(options.value);

		if (index != -1)
			return this.splice(index, 1);

		else return false;
	},
	$attach : function(arr)
	{
		if (Array.isArray(arr))
		{
			var self = this;
			arr.forEach(function(item){
				self.push(item);
			});
		}
		else
		{
			this.push(arr);
		}
	}
});