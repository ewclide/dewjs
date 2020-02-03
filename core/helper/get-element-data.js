import camelCaseToDash from './camel-case-to-dash';

export default function getElementData(settings, defaults, element, attributes) {
	const result = {};

    for (const name in defaults) {
        if (settings[name] !== undefined) {
            result[name] = settings[name];
            continue;
        }

        let attr = 'data-' + (attributes[name] || camelCaseToDash(name)), num;

        attr = element ? element.getAttribute(attr) : null;
        num = +attr;

        if (attr === '' || attr === 'true') attr = true;
        else if (attr === 'false') attr = false;
        else if (attr !== null && !isNaN(num)) attr = num;

        result[name] = attr !== null ? attr : defaults[name];
    }

    return result;
}