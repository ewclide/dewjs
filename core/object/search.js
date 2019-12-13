function _searchInObject(root, key, value, chld, all, depth) {
    if (!depth) return;

    const result = [];
    const field = root[key];

    if (value === field) {
        result.push(root);
        if (!all) return result;
    }

    const children = root[chld];

    if (Array.isArray(children)) {
        depth--;
        for (const child of children) {
            const inside = _searchInObject(child, key, value, chld, all, depth);
            if (inside && inside.length) {
                result.push(...inside);
                if (!all) return result;
            }
        }
    } else if (typeof children == 'object') {
        depth--;
        const found = _searchInObject(children, key, value, chld, all, depth);
        result.push(...found);
    }

    return result;
}

export default function search(root, key, value, settings = {}) {
    if (key === undefined || value === undefined) {
        log.error(`Object.search error: settings must have "key" and "value" props!`);
        return;
    }

    const {
        all = false,
        children = 'children',
        depth = 3
    } = settings;

    return _searchInObject(root, key, value, children, all, depth);
}