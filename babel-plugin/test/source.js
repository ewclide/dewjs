import { html, bind } from 'dewjs/singleton';
import { isType, randi, idGetter } from 'dewjs/function';
import { something } from 'somewhere';

const getId = idGetter('title_');

(async () => {
    await html.ready;

    const title = html.create('h1', { id: getId });
    html.body.append(title);
})()



