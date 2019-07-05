import { html } from 'dewjs';
import { randi, log } from 'dewjs/funcs';

console.log(randi())

log.warn('it works good!');

const work = html.create('h1').text('It works good!');
html.ready.then(() => html.body.append(work));
