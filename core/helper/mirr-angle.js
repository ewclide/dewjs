export default function mirrAngle(val, deg) {
    if (!Number.isFinite(val)) return val;
    const max = deg ? 360 : Math.PI * 2;
    const mod = val % max;
    const ang = mod < 0 ? max + mod : mod;
    return ang > max / 2 ? ang - max : ang;
}