import capitalize from '../../function/capitalize';

const prefices = ['webkit', 'moz', 'ms'];

function findProperty(target, name) {
    if (target[name] !== undefined) return target[name];

    for (const prefix of prefices) {
        const prop = target[prefix + capitalize(name)];
        if (prop !== undefined) return prop;
    }
}

function findEventName(name) {
    const element = document.documentElement;
    if (element['on' + name] !== undefined) return name;

    for (const prefix of prefices) {
        const eventName = prefix + name;
        if (element['on' + eventName] !== undefined) return eventName;
    }
}

function applyMethod(target, name, args = []) {
    const method = findProperty(target, name);
    if (typeof method !== 'function') {
        console.error(`Property "${name}" is not a function`);
        return;
    }

    return method.apply(target, args);
}

let fullscreen = false;

async function switchScreen(enabled) {
    if (enabled) {
        try {
            await applyMethod(document.documentElement, 'requestFullscreen');
        } catch (e) {
            console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
        }
    } else if (findProperty(document, 'fullscreenElement')) {
        await applyMethod(document, 'exitFullscreen');
    }

    fullscreen = enabled;
}

function isEnabled() {
    return fullscreen;
}

function onChange(handler) {
    if (typeof handler !== 'function') return;

    const eventName = findEventName('fullscreenchange');

    document.addEventListener(eventName, () => {
        fullscreen = Boolean(findProperty(document, 'fullscreenElement'));
        handler(fullscreen);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key !== 'F11') return;
        e.preventDefault();

        switchScreen(!fullscreen);
        handler(fullscreen);
    });
}

export default {
    isEnabled,
    switchScreen,
    onChange
}
