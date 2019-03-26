const jq = $html
.script('https://code.jquery.com/jquery-3.2.1.min.js')
.then((e) => log('jquery loaded!'))
.catch((e) => DEW.printErr(e));

$html.ready.then(() => log('dom loaded!'));

$html.select('.big-images').ready
.then(() => log('Images ready!'))
.catch((e) => log(e));
