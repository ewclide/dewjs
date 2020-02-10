import html from '../../../../core/common/html';

describe('htmlTools.getters', () => {
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
        const images = html.select('.images');
        // const src = images.elements[0].querySelectorAll('img');
        console.log(images.elements)
        expect(images.ready).toBeInstanceOf(Promise);
    });
});