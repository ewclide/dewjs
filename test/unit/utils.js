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

export function returnConsole() {
    window.console = window.nativeConsole;
}

export function clearConsole() {
    const { console } = window;
    console.log.mockClear();
    console.warn.mockClear();
    console.error.mockClear();
    console.time.mockClear();
    console.timeEnd.mockClear();
}

export function getConsoleMessage(type) {
    const { calls } = window.console[type].mock;
    const message = calls[calls.length - 1];

    clearConsole();

    return message;
}