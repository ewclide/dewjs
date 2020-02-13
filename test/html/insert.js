import {
    setFixture,
    html,
    useHtml,
    getElements,
    createSquare,
    showElements,
    compareScreenshot
} from './utils';

setFixture('insert', { only: false });

const getTest = (type) => {
    return async (t) => {
        const div = await createSquare(150);
        const insert = await html('getById', 'insert');
        const insertElement = await getElements('#insert');

        await showElements(insertElement);
        await useHtml(insert, type, div);
        await compareScreenshot(t, 'insert_' + type);
    }
}

test('before', getTest('before'));
test('after', getTest('after'));
test('begin', getTest('prepend'));
test('end', getTest('append'));

test('multiple', async (t) => {
    const div = await createSquare(150);
    const twins = await html('select', '.twins');

    await useHtml(twins, 'append', div);
    await compareScreenshot(t, 'insert_multiple');
});