export default function randf(min = 0, max = 1, accuracy) {
    const num = Math.random() * (max - min) + min;
    return accuracy ? parseFloat(num.toFixed(accuracy)) : num;
}