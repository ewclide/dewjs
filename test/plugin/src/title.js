import { html } from 'dewjs/singleton';
import { randi, idGetter } from 'dewjs/function';

const getUniqTitle = idGetter('title_');
const title = html
    .create('h2')
    .text(getUniqTitle())
    .style('font-size', randi(30, 50) + 'px');

export default title;