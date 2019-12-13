export default function clampSide(value, border, flip) {
    const f = flip ? -1 : 1;
    return (f * value) > (f * border) ? border : value;
}