import { HTMLTools } from '../../../../core/common/html/html-tools';
import html from '../../../../core/common/html';

describe('html', () => {
    test('create', () => {
        const div1 = html.create('div');
        expect(div1.native()).toBeInstanceOf(Element);
    
        const div2 = html.create('div', { id: 2, some: 'some' });
        expect(div2.native().id).toBe('2');
        expect(div2.native().getAttribute('some')).toBe('some');
    
        const div3 = html.create('div', null, { color: 'red' });
        expect(div3.native().style.color).toBe('red');
    });

    test('body', () => {
        expect(html.body).toBeInstanceOf(HTMLTools);
        expect(html.body.elements[0]).toBe(document.body);
    })

    test('ready', () => {
        expect(html.ready).toBeInstanceOf(Promise);
    })

    //extend
    //script
    //convert
    //parseXML
    //createStyleSheet
})
