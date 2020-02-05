export default function getPropByPath(obj, path) {
    if (!Array.isArray(path) || !path.length) return;

    return path.reduce((a, c) => a[c], obj);
}