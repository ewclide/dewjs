export default function clampAngle(val, deg) {
    if (!Number.isFinite(val)) return val;
    const max = deg ? 360 : Math.PI * 2;
    const mod = val % max;
    return mod < 0 ? max + mod : mod;
}