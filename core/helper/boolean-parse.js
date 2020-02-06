export default function booleanParse(value) {
    const result = /^\s*(?:'|")?(true|false)(?:'|")?\s*$/gi.exec(value);
    if (!result) return;
    return result[1].toLowerCase() === 'true' ? true : false;
}