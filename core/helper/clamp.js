export default function clamp(val, from, to) {
    if (val < from) return from;
	else if (val > to) return to;
	else return val;
}