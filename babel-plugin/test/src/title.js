import { html } from 'dewjs/singleton';
import { randi, idGetter } from 'dewjs/function';

const getUniqTitle = idGetter('title_');
const title = html
    .create('h2', { fontSize: randi(30, 50) + 'px' })
    .text(getUniqTitle());

export default title;