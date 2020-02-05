const LOG_IGNORE = [];

function _getSourceLog() {
	let stack = (new Error()).stack;

	if (stack) stack = stack.split('\n');
	else return '';

	let scripts = LOG_IGNORE.join('|');
	if (scripts) scripts += '|';
	const reg = new RegExp(`(${scripts}dew)(\.min|\.dev)?\.js|anonymous`, 'g');

	for (let i = 0; i < stack.length; i++) {
		if (stack[i].search(reg) == -1) {
			const src = stack[i].match(/https?:[^\)]+/g);
			if (src && src[0]) return src[0];
		}
	}

	return '';
}

export default function log() {
	const args = Array.from(arguments);
	const source = _getSourceLog();

    if (source) {
		args.push(` (src: ${source})`);
	}

	console.log.apply(null, args);
}

log.IGNORE = LOG_IGNORE;
log.json = (json, spaces = 4) => log(JSON.stringify(json, null, spaces));
log.time = (name) => console.time(name);
log.timeEnd = (name) => console.timeEnd(name);

log.errors = function(title, messages) {
	const source = _getSourceLog();
	const messageList = [].concat(messages);

	if (!messageList.length) return;

	let error = `Errors: ${title}\n`;
	messageList.forEach((message) => error += `  └─> ${message}\n` );
	if (source) error += `(src: ${source})`;

	console.error(error);

	return false;
}

log.error = function(...message) {
	const src = _getSourceLog();
	const text = ['Error:', ...message, src ? `\n(src: ${src})` : ''];

	console.error.apply(null, text);
}

log.warn = function(...message) {
	const src = _getSourceLog();
	const text = ['Warning:', ...message, src ? `\n(src: ${src})` : ''];

	console.warn.apply(null, text);
}