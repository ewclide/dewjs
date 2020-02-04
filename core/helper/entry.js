export default function entry(val, from, to, exceptBorders) {
    return exceptBorders ? val > from && val < to : val >= from && val <= to;
}