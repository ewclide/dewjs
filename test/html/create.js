import { setFixture, compareScreenshot, html, useHtml } from './utils';

setFixture('html', {
    before: (t) => {}
});

test('create', async () => {
    const div = await html('create', 'div', null, { width: '100px', height: '100px', background: 'red' });
    const body = await html('body');

    await useHtml(body, 'append', div);
    // const div1 = html.create('div');
    // expect(div1.native()).toBeInstanceOf(Element);

    // const div2 = html.create('div', { id: 2, some: 'some' });
    // expect(div2.native().id).toBe('2');
    // expect(div2.native().getAttribute('some')).toBe('some');

    // const div3 = html.create('div', null, { color: 'red' });
    // expect(div3.native().style.color).toBe('red');
});