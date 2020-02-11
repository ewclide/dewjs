import { setFixture, createSquare, html, useHtml, getElements, compareScreenshot } from './utils';

setFixture('visible', {
    before: (t) => {}
});

test.only('visible', async (t) => {
    const div = await createSquare(150);
    const targetVisible = await html('getById', 'target');
    const targetHidden = await html('getById', 'target-hidden');
    const [hiddenParent] = await getElements('.hidden');

    // visible
    await useHtml(targetVisible, 'append', div);
    await compareScreenshot(t, 'visible_square');
    await t.expect(await useHtml(div, 'visible')).eql({ elements: [], self: false });

    // hidden
    await useHtml(div, 'remove');
    await useHtml(targetHidden, 'append', div);
    await compareScreenshot(t, 'hidden_square');
    await t.expect(await useHtml(div, 'visible')).eql({ elements: [hiddenParent], self: false });
});