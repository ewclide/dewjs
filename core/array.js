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

class Methods
{
	constructor(arr)
    {
        this.arr = arr;
    }

    have(value)
	{
		var index = this.arr.indexOf(value);
		return index == -1 ? false : { index : index };
	}

	subtract(arr)
	{
		return this.arr.filter( item => arr.indexOf(item) < 0 );
	}

	difference(arr)
	{
		return this.arr.filter( item => arr.indexOf(item) < 0 )
			   .concat( arr.filter( item => this.arr.indexOf(item) < 0 ) );
	}

	compare(arr)
	{
		return this.arr.length == arr.length &&
			   this.arr.every( (item, index) => item === arr[index] );
	}

	naturalSort(settings = {})
	{
		return this.arr.sort( (cur, next) => {

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
	}

	search(val, settings = {})
	{
		var result = settings.inside
			? this.arr.filter( item => checkInclude(item[settings.inside], val, settings) )
			: this.arr.filter( item => checkInclude(item, val, settings) );

		return result.length ? result : false;
	}

	removeValue(value)
	{
		var list = Array.isArray(value) ? value : [value];

		return list.filter( item => {
			var index = this.arr.indexOf(item);
			if (index != -1)
			{
				this.arr.splice(index, 1);
				return true;
			}
			else return false;
		});
	}

	removeIndex(index)
	{
		var values = Array.isArray(index)
			? index.map( i => this.arr[i] )
			: this.arr[index];

		return this.removeValue(values);
	}
}

export function array(arr)
{
    return new Methods(arr);
}