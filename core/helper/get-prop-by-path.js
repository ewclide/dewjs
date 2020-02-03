export default function getPropByPath(obj, path) {
    if (!Array.isArray(path)) return;

    return path.reduce((a, c) => a[c], obj);
}