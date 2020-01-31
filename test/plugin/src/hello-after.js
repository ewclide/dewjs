import html from "dewjs/core/singleton/html";
import randKey from "dewjs/core/function/rand-key";
import capitalize from "dewjs/core/function/capitalize";
const text = capitalize('hello ' + randKey(10, ['lower', 'upper']));
const hello = html.create('p').text(text);
export default hello;
