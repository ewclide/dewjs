import { html } from 'dewjs/common';
import { randKey, capitalize } from 'dewjs/helper';

const text = capitalize('hello ' + randKey(10, ['lower', 'upper']));
const hello = html.create('p').text(text);

export default hello;