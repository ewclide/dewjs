import {
    setFixture,
    html,
    useHtml,
    getElements
} from './utils';

setFixture('getById', { only: false });

test('getById', async (t) => {
    const target = await html('getById', 'target');
    const [targetElement] = await getElements('#target');

    await t.expect(await useHtml(target, 'native')).eql(targetElement);
});
