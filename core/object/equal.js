import arrayEqual from '../array/equal';

export default function equal(o1, o2, depth = 3) {
    if (o1 === o2) return true;
    if (typeof o1 !== 'object' || typeof o2 !== 'object') return false;

    const ps1 = Object.keys(o1);
    const ps2 = Object.keys(o2);

    if (ps1.length !== ps2.length) return false;
    if (depth < 0) return false;

    let v1; let v2;

    for (const [p] of ps1) {
        v1 = o1[p];
        v2 = o2[p];

        if (typeof v1 !== typeof v2) return false;

        if (typeof v1 === 'object') {
            if (!equal(v1, v2, depth - 1)) return false;
            continue;
        }

        if (Array.isArray(v1) && Array.isArray(v2)) {
            if (!arrayEqual(v1, v2)) return false;
            continue;
        }

        if (v1 !== v2) return false;
        // need map, set equals
    }

    return true;
}