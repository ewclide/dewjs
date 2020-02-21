import bind from '../common/bind';

function beforeChange(target, name, descriptor) {
    return descriptor;
}

function afterChange(target, name, descriptor) {
    return descriptor;
}

function bindWith(target, name, descriptor) {
    return descriptor;
}

export default {
    beforeChange,
    afterChange,
    with: bindWith
};