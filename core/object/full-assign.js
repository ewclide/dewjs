function _defineProperties(target, source) {
    for (const prop in from) {
        const desc = Object.getOwnPropertyDescriptor(source, prop);
        if (desc) {
            Object.defineProperty(target, prop, desc);
        } else {
            target[prop] = source[prop];
        }
    }

    return target;
}

export default function fullAssign(target, source, copy) {
    const result = copy ? _defineProperties({}, target) : target;

    if (Array.isArray(source)) {
        source.forEach((src) => _defineProperties(result, src));
        return result;
    }

    return _defineProperties(result, source);
}