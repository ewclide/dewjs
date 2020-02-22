import bind from '../common/bind';

const connectors = new Map();
function registerConnector(current, target, connector) {
    if (typeof target === 'function') {
        connectors.set(current, connector);
        connectors.set(target, connector);
    }
}

function left(target, targetProperty, modifier) {
    const type = 'left';

    return function (current, property, descriptor) {
        const connector = {
            type,
            left: { object: current, field: property },
            right: { object: target, field: targetProperty },
            modifier
        };

        registerConnector(current, target, connector);
        return descriptor;
    }
}

function observer(Type) {
    return new Proxy(Type, {
        construct: (self) => {
            console.log()
            return self;
        }
    });
}

export default {
    observer,
    left
}