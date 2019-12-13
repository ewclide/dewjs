export default function formatNumber(value, space = ' ') {
    return String(Math.floor(value)).split('').reverse()
        .reduce((a, c, i, { length }) => {
            const n = i + 1;
            return (n > 1 && n < length && !(n % 3) ? space : '') + c + a;
        }, '');
}