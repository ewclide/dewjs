export default function makeIterable(context, handler) {
    if (typeof context !== 'object' && typeof handler !== 'function') {
        log.error(`makeIterable must recieve context ${context} of object and handler ${handler} as function`);
        return;
    }

    const product = { value: null, done: false };
    const iterator = {
        next() {
            handler(product, context);
            return product;
        }
    };

    context[Symbol.iterator] = () => iterator;
}