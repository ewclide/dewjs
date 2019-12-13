import log from './log';

export default function fetchSettings(settings, restrictions = {}) {
    const { defaults, required, filter = 0, types = 0, rates = 0 } = restrictions;
	const propList = Object.assign({}, required, defaults);
	const result = {};

    for (const propName in propList) {
		const haveProp = settings[propName] !== undefined;

        if (required && propName in required && !haveProp) {
            log.error(`Settings must contain "${propName}" property`);
            return;
        }

        const propValue = haveProp ? settings[propName] : propList[propName];

        if (propValue === null) {
            result[propName] = propValue;
            continue;
        }

        const propFilter = filter[propName];

        if (typeof propFilter == 'function' && !propFilter(propValue)) {
            log.error(`Property "${propName}" is invalid`);
            return;
        }

		const propType = types[propName];

        if (propType !== undefined) {
			const isInstanceOf = propType.prototype ? propValue instanceof propType : false;

			if (!(typeof propValue == propType || isInstanceOf)) {
				log.error(`Property "${propName}" must be of type "${propType.name || propType}"`);
            	return;
			}
        }

        const propRates = rates[propName];

        if (Array.isArray(propRates) && !propRates.includes(propValue)) {
            log.error(`Invalid value "${propValue}" of property "${propName}"`);
            return;
        }

        result[propName] = propValue;
    }

	return result;
}