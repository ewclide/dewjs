export default function clampBySteps(value, steps) {
    if (steps.length < 2) return value;

    const last = steps[steps.length - 1];
	const first = steps[0];
	let prev = steps[0];

    for (let i = 1; i < steps.length; i++) {
        const step = steps[i];
        if (step < prev) continue;

        if (value >= prev && value <= step) {
            return roundBetween(value, prev, step);
        }

        prev = steps[i];
    }

    return roundBetween(value, first, last);
}