import { setFixture, html, htmlBody, useHtml, getElements, compareScreenshot } from './utils';

setFixture('native');

test('native', async (t) => {
    const custom = await html('create', 'div', { id: 'custom' });
    await htmlBody('append', custom);
    const [customElement] = await getElements('#custom');

    const twins = await html('select', '.twins');
    const twinsElements = await getElements('.twins');

    await t.expect(await useHtml(custom, 'native')).eql(customElement);
    await t.expect(await useHtml(twins, 'native')).eql(twinsElements);
});