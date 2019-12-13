export default function mapFromArray(array) {
    return array.reduce((map, [k, v]) => {
        map.set(k, v);
        return map;
    }, new Map());
}