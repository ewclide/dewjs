import html from "dewjs/singleton/html";
import bind from "dewjs/singleton/bind";
import isType from "dewjs/function/is-type";
import randi from "dewjs/function/randi";
import idGetter from "dewjs/function/id-getter";
import { something } from 'somewhere';
const getId = idGetter('title_');

(async () => {
  await html.ready;
  const title = html.create('h1', {
    id: getId
  });
  html.body.append(title);
})();
