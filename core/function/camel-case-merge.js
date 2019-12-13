export default function camelCaseMerge(...list) {
	return list.reduce((res, cur, index) => {
		return res + (index ? cur.charAt(0).toUpperCase() + cur.slice(1) : cur)
	}, '');
}