const { log } = Dew.helper;
const { html } = Dew.common;

let place = html.create('span', 'place').text('place');
for (let i = 0; i < 1000; i++)
    html.body.after(place);

let elemNative = document.querySelectorAll('.place');
log.time('css - native');
for (let j = 0; j < elemNative.length; j++)
    elemNative[j].style.background = 'red';
log.timeEnd('css - native');

let elemDEW = html.select('.place');
log.time('css - dew');
elemDEW.style('background', 'red');
log.timeEnd('css - dew');

let elemJquery = $('.place');
log.time('css - jquery');
elemJquery.css('background', 'red');
log.timeEnd('css - jquery');