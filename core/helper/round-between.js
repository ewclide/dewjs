export default function roundBetween(value, begin = 0, end = 1) {
    const mid = begin + (end - begin) / 2;
    return value >= mid ? end : begin;
}