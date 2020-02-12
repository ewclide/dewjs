import { ClientFunction } from 'testcafe';
import { ColoredError } from 'node-con-color';
import testcafeConfig from '../../../.testcaferc.json';
import compareImages from './compare';

const prepareHtml = ClientFunction(() => {
    const shells = [];
    const instances = [];

    const prepareArgs = (args) => {
        return args.map(arg => arg && arg.isInstance ? instances[arg.index] : arg);
    }

    const getResult = (input) => {
        if (input && (input instanceof Element || input.isHTMLTools)) {
            if (instances.includes(input)) {
                return shells[instances.indexOf(input)];
            }

            const shell = {
                index: instances.length,
                get isInstance() { return true }
            }

            instances.push(input);
            shells.push(shell);

            return shell;
        }

        if (Array.isArray(input)) {
            return input.map(item => getResult(item));
        }

        if (typeof input === 'object') {
            for (const name in input) {
                input[name] = getResult(input[name]);
            }
        }

        return input;
    }

    const getInstance = (instance) => {
        if (!instance || !instance.isInstance) {
            throw new Error(`argument must be an instance, got "${instance}"`);
        }

        return instances[instance.index];
    }

    const useClientHtml = (instance, propName, args) => {
        const prop = instance[propName];
        const result = typeof prop === 'function'
            ? prop.bind(instance)(...prepareArgs(args)) : prop;

        return getResult(result);
    };

    window.__global = {
        shells,
        instances,
        getInstance,
        useClientHtml,
        getResult
    };
});

function setFixture(name, options = {}) {
    const { only, before = () => {}, size = {} } = options;
    const currentFixture = only ? fixture.only : fixture;

    currentFixture(name)
        .page('localhost:3000/test/page')
        .beforeEach(async (t) => {
            if (size) {
                await t.resizeWindow(size.width || 800, size.height || 800);
                await t.eval(() => window.location.reload(true));
                await prepareHtml();
            }

            await before(t);
        });
}

async function compareScreenshot(t, name, threshold = 0.001) {
    const generate = process.env.GENERATE_SCREENSHOTS === 'true';
    const fixtureName = t.testRun.test.testFile.currentFixture.name;
    const testName = t.testRun.test.name;
    const scrName = name || testName;

    const work = `work/${fixtureName}/${scrName}.png`;
    const etalon = `etalon/${fixtureName}/${scrName}.png`;
    const diff = `diff/${fixtureName}/${scrName}.png`;

    await t.takeScreenshot({
        path: generate ? etalon : work,
        fullPage: true
    });

    if (generate) return;

    const compareCallback = ({ equal, difference }) => {
        if (equal) return;
        throw new ColoredError(`Images are too different (difference #3{${difference}%} > #6{${threshold * 100}%}). See at #12{"${diff}"}\n`);
    }

    const realPath = testcafeConfig.screenshots.path + '/';

    compareImages({
        etalon: realPath + etalon,
        work: realPath + work,
        diff: realPath + diff,
        threshold
    }, compareCallback);
}

const html = ClientFunction((propName, ...args) => {
    const { useClientHtml } = window.__global;
    const { html } = window.Dew.common;
    return useClientHtml(html, propName, args);
});

const htmlBody = ClientFunction((propName, ...args) => {
    const { useClientHtml } = window.__global;
    const { html } = window.Dew.common;
    return useClientHtml(html.body, propName, args);
});

const useHtml = ClientFunction((target, propName, ...args) => {
    const { useClientHtml, getInstance } = window.__global;
    const instance = getInstance(target);
    return useClientHtml(instance, propName, args);
});

const createImages = ClientFunction((path, target = 'body', count = 1) => {
    const targetElement = document.querySelector(target);
    const images = { ready: 0, count };
    let image;

    for (let i = 0; i < count; i++) {
        image = new Image();
        image.src = path;
        image.onload = () => images.ready++;

        targetElement.appendChild(image);
    }

    window.__images = images;
});

const checkImagesReady = ClientFunction(() => {
    const images = window.__images;
    if (!images) {
        throw new Error('Images is not created');
    }

    const { ready, count } = images;
    return ready === count;
});

const getElements = ClientFunction((selector) => {
    const { getResult } = window.__global;
    const elements = document.querySelectorAll(selector);
    const result = [];

    for (const element of elements) {
        result.push(element)
    }

    return getResult(result);
});

const sleep = (time) => new Promise(resolve => setTimeout(resolve, time));

async function createSquare(size = 100, background = 'red') {
    const styles = { width: `${size}px`, height: `${size}px`, background };
    const square = await html('create', 'div', null, styles);
    return square;
}

export {
    html,
    htmlBody,
    useHtml,
    getElements,
    createSquare,
    createImages,
    checkImagesReady,
    setFixture,
    compareScreenshot,
    sleep
}