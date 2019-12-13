function _createClone(object, deep) {
    function Clone() {
        for (let field in object) {
            if (object.hasOwnProperty(field)) {
                this[field] = deep ? _createClone(object[field], true) : object[field];
            }
        }
    }

    if (Array.isArray(object)) {
        return object.slice();
    }

    else if (typeof object == 'object') {
        Clone.prototype = '__proto__' in object
        ? object.__proto__ : Object.getPrototypeOf(object);

        Clone.constructor = object.constructor;

        return new Clone();
    }

    else return object;
}

export default function clone(target, deep) {
    return target.constructor != Object
    ? Object.assign((new target.constructor()), target)
    : _createClone(target, deep)
}