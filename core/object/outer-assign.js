export default function outerAssign(target, source, copy) {
    const result = copy ? Object.assign({}, target) : target;

    if (Array.isArray(source)) {
        source.forEach((src) => outerAssign(result, src));
        return result;
    }

    for (const prop in source) {
        if (!(prop in result)) {
            result[prop] = source[prop];
        }
    }

    return result;
}