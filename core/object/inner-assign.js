function _fetchProp(prop, objects) {
    for (const obj of objects) {
        if (prop in obj) return obj;
    }
}

export default function innerAssign(target, source, copy) {
    const result = copy ? Object.assign({}, target) : target;

    if (Array.isArray(source)) {
        for (const prop in result) {
            const val = _fetchProp(prop, source);
            if (val !== undefined) result[prop] = val;
        }

        return result;
    }

    for (const prop in result) {
        if (prop in source) {
            result[prop] = source[prop];
        }
    }

    return result;
}