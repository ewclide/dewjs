import html from '../../../../core/common/html';

describe('html', () => {
    test('isHTMLTools', () => {
        const div = html.create('div');
        expect(div.isHTMLTools).toBe(true);
    });

    test('length', () => {
        const div = html.create('div');
        expect(div.length).toBe(1);
    });

    test('tag', () => {
        const div = html.create('div');
        expect(div.tag).toBe('div');
    });

    test('selectedIndex', () => {
        const select = html.create('select');
        const option = html.create('option');
        select.append(option);
        expect(select.selectedIndex).toBe(0);
    });

    test('ready', () => {
        expect(html.ready).toBeInstanceOf(Promise);
    });
});