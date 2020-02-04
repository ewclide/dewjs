export const degToRad = Math.PI / 180;

export function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}