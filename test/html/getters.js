import { setFixture, html, useHtml, createImages, checkImagesReady } from './utils';

setFixture('getters', {
    before: (t) => {}
});

test('isHTMLTools', async (t) => {
    const div = await html('create', 'div');
    await t.expect(await useHtml(div, 'isHTMLTools')).eql(true);
});

test('length', async (t) => {
    const div = await html('create', 'div');
    await t.expect(await useHtml(div, 'length')).eql(1);

    const twins = await html('select', '.twins');
    await t.expect(await useHtml(twins, 'length')).eql(3);
});

test('tag', async (t) => {
    const div = await html('create', 'div');
    await t.expect(await useHtml(div, 'tag')).eql('div');
});

test('selectedIndex', async (t) => {
    const select = await html('create', 'select');
    await t.expect(await useHtml(select, 'selectedIndex')).eql(-1);

    const options = [
        await html('create', 'option'),
        await html('create', 'option')
    ];

    await useHtml(select, 'append', ...options);
    await t.expect(await useHtml(select, 'selectedIndex')).eql(0);
    await useHtml(select, 'choose', 1);
    await t.expect(await useHtml(select, 'selectedIndex')).eql(1);
});

test('ready', async (t) => {
    const imagesBlock = await html('select', '.images');

    await createImages('assets/img.png', '.images', 5);
    await useHtml(imagesBlock, 'ready');
    await t.expect(await checkImagesReady()).eql(true);
});
