import {
    setFixture,
    createSquare,
    clientWindow,
    htmlBody,
    useHtml,
    getElements,
    setElementStyle,
    callElementMethod,
    compareScreenshot
} from './utils';

setFixture('inScreen');

test('inScreen', async (t) => {
    const redSquare = await createSquare(150);
    await htmlBody('append', redSquare);
    const [bodyElement] = await getElements('body');
    await setElementStyle(bodyElement, 'height', '2000px');

    await t.expect(await useHtml(redSquare, 'inScreen')).eql(true);
    await compareScreenshot(t, 'square_in_screen');

    await callElementMethod(clientWindow, 'scroll', [0, 500]);
    await t.expect(await useHtml(redSquare, 'inScreen')).eql(false);
    await compareScreenshot(t, 'square_out_of_screen');
});