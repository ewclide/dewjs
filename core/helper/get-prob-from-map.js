export default function getProbFromMap(probs) {
    const prob = Math.random();
    let prev = 0;

    for (const [key, value] of probs) {
        const cur = prev + value;

        if (prob >= prev && prob <= cur) {
            return key;
        }

        prev += value;
    }

    return probs.keys().next().value;
}