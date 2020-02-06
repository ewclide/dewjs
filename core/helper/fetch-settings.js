import log from './log';

function showMessage(message, cast) {
    if (!cast) {
        log.error(message);
        return;
    }

    throw new Error(message);
}

const basicTypes = new Set([Number, String, Boolean, Function, 'number', 'string', 'boolean', 'function']);
const getBasicType = (T) => basicTypes.has(T) ? (T.name || T).toLowerCase() : false;

const printType = (type) => Array.isArray(type)
    ? `[${type.map(sub => printType(sub)).join()}]`
    : type.name || type;

const printValue = (value) => Array.isArray(value)
    ? `[${value.slice(0, 3).map(sub => printValue(sub)).join()}${value.length > 3 ? '...' : ''}]`
    : String(value);

const typeHandlers = {
    array: (v) => Array.isArray(v),
    number: (v) => typeof v === 'number',
    string: (v) => typeof v === 'string',
    boolean: (v) => typeof v === 'boolean',
    function: (v) => typeof v === 'function',
    instance: (v, t) => v instanceof t
};

function getTypeHandler(type) {
    if (type === Array || type === 'array') {
        return typeHandlers.array;
    }

    const basicType = getBasicType(type);
    if (basicType) {
        return typeHandlers[basicType];
    }

    if (typeof type === 'function') {
        return typeHandlers.instance;
    }

    throw Error(`Unknown type "${type}"`);
}

function checkoutTypes(value, types) {
    for (const type of types) {
        const isType = getTypeHandler(type);
        if (isType(value, type)) return true;
    }

    return false;
}

function checkoutArrayTypes(array, types) {
    if (!Array.isArray(array)) return false;

    for (const value of array) {
        if (!checkoutTypes(value, types))
        const isType = getTypeHandler(type);
        if (isType(value)) return true;
    }

    return false;
}

export default function fetchSettings(inputObject, description = {}, common = {}) {
    const { strict = true, cast = false } = common;
    const propNames = [...Object.keys(inputObject), ...Object.keys(description)];
    const result = {};

    for (const name of propNames) {
        let desc = name in description ? description[name] : null;

        if (!desc && strict) {
            showMessage(`Unexpected property "${name}"`, cast);
            continue;
        }

        if (typeof desc !== 'object') {
            desc = { defaultValue: desc };
        }

        const { defaultValue, required, filter, type, oneOfTypes = [], arrayOf, oneOf = [] } = desc;
        const haveProp = inputObject[name] !== undefined;

        // checkout required
        if (required && !haveProp) {
            showMessage(`Property "${name}" is expected in settings object`, cast);
            continue;
        }

        // use default
        if (!haveProp) {
            result[name] = defaultValue;
            continue;
        }

        const value = inputObject[name];

        // checkout types
        const types = type ? [...oneOfTypes, type] : oneOfTypes;

        if (types.length && !checkoutTypes(value, types)) {
            const typeMessage = types.length > 1
                ? `one of types ${printType(types)}`
                : `a type ${printType(types[0])}`

            showMessage(`Value "${printValue(value)}" of property "${name}" must be ${typeMessage}`, cast);
            continue;
        }

        if (arrayOf && Array.isArray(value) && !checkoutTypes()) {

        }

        // checkout available values
        if (Array.isArray(oneOf) && oneOf.length && !oneOf.includes(value)) {
            showMessage(`Invalid value "${value}" of property "${name}", it must be one of [${oneOf.join()}]`, cast);
            continue;
        }

        // pass throught filter
        if (typeof filter === 'function' && !filter(value)) {
            showMessage(`Value "${value}" of property "${name}" can't be passed throught filter`, cast);
            continue;
        }

        result[name] = value;
    }

    return result;
}