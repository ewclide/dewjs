import { html } from 'dewjs/singleton';
import { randKey, capitalize } from 'dewjs/function';

const text = capitalize('hello ' + randKey(10, ['lower', 'upper']));
const hello = html.create('p').text(text);

export default hello;