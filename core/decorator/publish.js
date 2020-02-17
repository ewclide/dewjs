import publish from '../helper/publish';

const $methods = Symbol('public_methods');
const $properties = Symbol('public_properties');

function publishDecorator(SourceClass) {
    const { prototype } = SourceClass;
    const methods = prototype[$methods] || [];
    const properties = prototype[$properties] || [];

    return publish(SourceClass, methods, properties);
}

function register(target, name, propsListKey) {
    if (!(propsListKey in target)) {
        target[propsListKey] = [];
    }

    target[propsListKey].push(name);
}

function wrapMethod(target, name, descriptor) {
    register(target, name, $methods);
    return descriptor;
}

function wrapProperty(target, name, descriptor) {
    register(target, name, $properties);
    return descriptor;
}

publishDecorator.method = wrapMethod;
publishDecorator.property = wrapProperty;

export default publishDecorator;