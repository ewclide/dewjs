import { setFixture, createSquare, htmlBody, useHtml, getElements, getElementStyle, compareScreenshot } from './utils';

setFixture('display');

test('display', async (t) => {
    const redSquare = await createSquare(150);
    await htmlBody('append', redSquare);
    const [redSquareElement] = await getElements('#red-square');

    let displayStyle;
    await t.expect(await useHtml(redSquare, 'display')).eql(true);
    await compareScreenshot(t, 'red_square_visible');
    displayStyle = await getElementStyle(redSquareElement, 'display');
    await t.expect(displayStyle).eql('');

    await useHtml(redSquare, 'hide');
    await t.expect(await useHtml(redSquare, 'display')).eql(false);
    await compareScreenshot(t, 'red_square_hidden');
    displayStyle = await getElementStyle(redSquareElement, 'display');
    await t.expect(displayStyle).eql('none');
});