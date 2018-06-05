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

		list.forEach( (item, i) => {
			var index = this.arr.indexOf(item);
			index != -1 ? this.arr.splice(index, 1) : list.splice(i, 1);
		});

		return list;
	}

	removeIndex(index)
	{
		var list = [].concat(index),
			saved = list.map( i => this.arr[i] );

		return this.removeValue(saved);
	}
}

export function array(arr)
{
    return new Methods(arr);
}