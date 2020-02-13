import {
    setFixture,
    html,
    useHtml,
    getElements,
    stopwatch
} from './utils';

setFixture('select', { only: false });

test('root', async (t) => {
    const twins = await html('select', '.twins');
    const twinsElements = await getElements('.twins');

    await t.expect(await useHtml(twins, 'native')).eql(twinsElements);
});

test('root sub elements', async (t) => {
    const twinsSpan = await html('select', '.twins span');
    const spanElements = await getElements('.twins span');

    await t.expect(await useHtml(twinsSpan, 'native')).eql(spanElements);
});

test('consistently', async (t) => {
    const twins = await html('select', '.twins');
    const twinsSpan = await useHtml(twins, 'select', 'span');
    const spanElements = await getElements('.twins span');

    await t.expect(await useHtml(twinsSpan, 'native')).eql(spanElements);
});

test('speed', async (t) => {
    stopwatch.start();
    const twins = await html('select', '.twins');
    await t.expect(stopwatch.stop().time).within(15, 40);

    stopwatch.start();
    const twinsSpan = await useHtml(twins, 'select', 'span');
    await t.expect(stopwatch.stop().time).within(15, 40);
});
