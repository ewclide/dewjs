export default function clampOut(val, from, to) {
    let res = val;
    if (Number.isFinite(from) || Number.isFinite(to)) {
        const half = from + ((to - from) / 2);
        if (val >= half && val < to) res = to;
        else if (val < half && val > from) res = from;
    }
    return res;
}