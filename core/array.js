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

	copy()
	{
		return this.arr.slice().sort();
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

	smartSort()
	{
		return this.arr.sort(function(prev, next){

			var result = 0, regClear = /[^\d+\-,\.]/gm;

			prev = prev.replace(",", ".").replace(regClear, "").split("-").map( item => +item );
			next = next.replace(",", ".").replace(regClear, "").split("-").map( item => +item );

			if (prev[0] > next[0]) result = 1;
			else if (prev[0] < next[0]) result = -1;
			else if (prev[0] == next[0])
			{
				prev = prev.length > 1 ? prev[1] : prev[0];
				next = next.length > 1 ? next[1] : next[0];
				result = prev > next ? 1 : -1;
			}

			return result;
		});
	}

	removeValue(value)
	{
		var list = [].concat(value);

		for (var i = 0; i < this.arr.length; i++)
			if (list.includes(this.arr[i]))
				(this.arr.splice(i, 1) && i--);
			else continue;

		return list;
	}

	removeIndex(index)
	{
		var saved = [],
			list  = [].concat(index);

		for (var i = 0; i < list.length; i++)
		{
			var indexDel = list[i];
			if (indexDel < this.arr.length && indexDel >= 0)
			{
				saved.push(this.arr[indexDel]);
				this.arr[indexDel] = undefined;
			}
		}

		this.removeValue();

		return saved;
	}

	removeFirst()
	{
		return this.arr.splice(0, 1);
	}

	removeLast()
	{
		return this.arr.pop();
	}
}

export function array(arr)
{
    return new Methods(arr);
}