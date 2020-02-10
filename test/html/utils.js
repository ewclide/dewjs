import { ClientFunction } from 'testcafe';

const prepareHtml = ClientFunction(() => {
    window.__instances = [];
    window.__prepareArgs = (args) => {
        const instances = window.__instances;
        return args.map(arg => arg && arg.isInstance ? instances[arg.index] : arg);
    }
    window.__getResult = (result) => {
        const instances = window.__instances;
        if (typeof result === 'object' && result.isHTMLTools) {
            instances.push(result);
            return {
                index: instances.length - 1,
                get isInstance() { return true }
            }
        }

        return result;
    }

    window.__getInstance = (instance) => {
        if (!instance || !instance.isInstance) {
            throw new Error(`argument must be an instance, got "${instance}"`);
        }

        return window.__instances[instance.index];
    }
});

function setFixture(name, options = {}) {
    const { only, before = () => {}, size = {} } = options;
    const currentFixture = only ? fixture.only : fixture;

    currentFixture('dewjs: ' + name)
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

async function compareScreenshots(t, name) {
    const etalonSrc = `../screenshots/etalon/${name}.png`;
    const workSrc = `../screenshots/work/${name}.png`;

    await t.takeScreenshot({
        path: etalonSrc,
        fullPage: true
    });

    const etalon = new Image()
    const work = new Image();

    etalon.src = etalonSrc;
    work.src = workSrc;

    const etalonBase64 = getBase64Image(etalon);
    const workBase64 = getBase64Image(work);

    if (etalonBase64 !== workBase64) {
        throw new Error(`images are different:\n etalon => "${etalonSrc}", work => "${workSrc}"`);
    }
}

const html = ClientFunction((propOrMethod, ...args) => {
    const prepareArgs = window.__prepareArgs;
    const getResult = window.__getResult;

    const { html } = window.Dew.common;
    const result = !args.length
        ? html[propOrMethod] : html[propOrMethod](...prepareArgs(args));

    return getResult(result);
});

const useHtml = ClientFunction((target, method, ...args) => {
    const prepareArgs = window.__prepareArgs;
    const getInstance = window.__getInstance;
    const getResult = window.__getResult;

    const instance = getInstance(target);
    const result = instance[method](...prepareArgs(args));

    return getResult(result);
});

const checkElement = ClientFunction((target, index) => {
        const getInstance = window.__getInstance;
        const instance = getInstance(target);

        return instance.elements[index] instanceof Element;
    }
    // { dependencies: { element } }
);

export {
    html,
    useHtml,
    checkElement,
    setFixture,
    compareScreenshots
}