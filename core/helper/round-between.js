export default function roundBetween(value, begin, end) {
    const mid = begin + (end - begin) / 2;
    return value > mid ? end : begin;
}