import { html } from 'dewjs/common';
import title from './title';
import hello from './hello';

(async () => {
    await html.ready;
    html.body.append(title, hello);
})()