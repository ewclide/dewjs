import { html } from 'dewjs/singleton';
import { randKey, capitalize } from 'dewjs/function';

const test = capitalize('hello ' + randKey());
const hello = html.create('p').text(test);

export default hello;