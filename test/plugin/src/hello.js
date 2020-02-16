import { html as HTML } from 'dewjs/common';
import { randKey, capitalize } from 'dewjs/helper';

const text = capitalize('hello ' + randKey(10, ['lower', 'upper']));
const hello = HTML.create('p').text(text);

export default hello;