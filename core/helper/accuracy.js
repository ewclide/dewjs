export default function accuracy(num) {
    if (typeof num !== 'number') return;
    const [, fraction] = num.toString().split('.');
    return fraction ? fraction.length : 0;
}