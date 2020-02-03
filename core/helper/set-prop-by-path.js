export default function setPropByPath(obj, srcPath, val) {
    if (!Array.isArray(srcPath)) {
		log.error(`setPropByPath - path ${srcPath} must be an array`);
		return;
	}

    const path = srcPath.slice();
    const propName = path.pop();

    const target = path.reduce((a, c) => a[c], obj);
    if (!target || !target[propName]) return;

    if (typeof val === 'function') {
        target[propName] = val(target[propName]);
    } else {
        target[propName] = val;
    }
}