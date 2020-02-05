export const degToRad = Math.PI / 180;

export function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

export function swapConsole() {
    window.nativeConsole = console;
    window.console = {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        time: jest.fn(),
        timeEnd: jest.fn()
    };
}