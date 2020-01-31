import { html } from 'dewjs/singleton';
import title from './title';
import hello from './hello';

(async () => {
    await html.ready;
    html.body.append(title, hello);
})()