Array.prototype.$define({
	$have : function(value)
	{
		var index = this.indexOf(value);
		if (index == -1) return false;
		else return { index : index }
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

function removeIndex(array, index)
{
	if (index < (array.length - 1) && index > 0)
		return array.splice(index, 1);
	else return false;
}

function removeValue(array, value)
{
	var index = array.indexOf(value);
	if (index != -1) return array.splice(index, 1);
	else return false;
}

Array.prototype.$define("$remove", {
	get : function()
	{
		var self = this;

		return {
			index : function(index)
			{
				if (Array.isArray(index))
				{
					var result = [];

					result = index.map(function(i){
						return removeIndex(self, i);
					});

					log("need check!")

					return result;
				}
				else return removeIndex(self, index);
			},
			value : function(value)
			{
				if (Array.isArray(value))
				{
					var result = [];

					result = value.map(function(i){
						return removeValue(self, i);
					});

					return result;
				}
				else return removeValue(self, value);
			},
			first : function()
			{
				return self.splice(0, 1);
			},
			last : function()
			{
				return self.pop();
			}
		}
	},
	set : function(){}
});