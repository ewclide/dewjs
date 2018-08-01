function checkInclude(first, second, settings)
{
	if (!second) return true;

	if (!settings.caseSens)
	{
		first = first.toUpperCase();
		second = second.toUpperCase();
	}

	if (settings.whole)
		return first == second  ? true : false;

	else
	{
		var index = first.indexOf(second);

		if (settings.begin)
			return index != -1 && ( index == 0 || first[index - 1] == " " ) ? true : false;

		else return index != -1 ? true : false;
	}

	return;
}

function natConv(value)
{
	var dot = '', range;
	
	if (!isNaN(+value)) return value;

	range = parseInt(value.replace(/\-\s+\.,/g, ''), 10);

	if (!isNaN(range))
		return +value.replace(/[^\d+]/g, function(str){
			if (str == "," || str == "." || str == "-")
			{
				dot = dot ? "0" : ".";
				return dot;
			}
			else return '';
		});

	else return value.replace(/\s+/g, '').toUpperCase();
}

export var arrayExtends = {

    have : function(arr, value)
	{
		var index = arr.indexOf(value);
		return index == -1 ? false : { index : index };
	},

	subtract : function(arr, arrSub)
	{
		return arr.filter( item => arrSub.indexOf(item) < 0 );
	},

	difference : function(arr, arrDiff)
	{
		return arr.filter( item => arrDiff.indexOf(item) < 0 )
			   .concat( arrDiff.filter( item => arr.indexOf(item) < 0 ) );
	},

	compare : function(arr, arrComp)
	{
		return arr.length == arrComp.length &&
			   arr.every( (item, index) => item === arrComp[index] );
	},

	unique : function(arr)
	{
		for (var i = 0; i < arr.length; ++i)
		{
			for (var j = i+1; j < arr.length; ++j)
				if (arr[i] === arr[j]) arr.splice(j--, 1);
		}
	},

	naturalSort : function(arr, settings = {})
	{
		return arr.sort( (cur, next) => {

			var result = 0;

			if (settings.inside)
			{
				cur = cur[settings.inside];
				next = next[settings.inside];
			}

			result = natConv(next) > natConv(cur) ? -1 : 1;

			if (settings.reverse) result *= -1

			return result;
		});
	},

	search : function(arr, val, settings = {})
	{
		var result = settings.inside
			? arr.filter( item => checkInclude(item[settings.inside], val, settings) )
			: arr.filter( item => checkInclude(item, val, settings) );

		return result.length ? result : false;
	},

	removeValue : function(arr, value)
	{
		var list = Array.isArray(value) ? value : [value];

		return list.filter( item => {
			var index = arr.indexOf(item);
			if (index != -1)
			{
				arr.splice(index, 1);
				return true;
			}
			else return false;
		});
	},

	removeIndex : function(arr, index)
	{
		var values = Array.isArray(index)
			? index.map( i => arr[i] ) : arr[index];

		return arrayExtends.removeValue(arr, values);
	}
}