import log from './log';
import camelCaseToDash from './camel-case-to-dash';
import strParse from './str-parse'

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

function checkoutArrayTypes(array, types, maxCheckLength, data = {}) {
    if (!Array.isArray(array)) {
        data.value = `"${array}"`;
        return false;
    }

    let index = 0;
    for (const value of array) {
        if (index++ >= maxCheckLength) break;
        if (!checkoutTypes(value, types)) {
            data.value = `of element[${index}] "${value}"`;
            return false;
        }
    }

    return true;
}

function getValue(name, desc, input, element) {
    let value = input[name];

    if (value === undefined && element instanceof Element) {
        const { attribute } = desc;
        const attr = (attribute || 'data-' + camelCaseToDash(name));
        value = element.getAttribute(attr);
        value = value === '' ? true : strParse(value);
    }

    return value;
}

export default function fetchSettings(input, description = {}, common = {}) {
    const { strict = true, cast = false, element } = common;
    const propNames = [...Object.keys(input), ...Object.keys(description)];
    const result = {};

    for (const name of propNames) {
        let desc = name in description ? description[name] : null;

        if (!desc) {
            if (strict) showMessage(`Unexpected property "${name}"`, cast);
            else result[name] = input[name];
            continue;
        }

        if (typeof desc !== 'object') {
            desc = { defaultValue: desc };
        }

        const { defaultValue, required, filter, type, oneofTypes = [], arrayof, maxCheckLength = 20, oneof = [] } = desc;
        const value = getValue(name, desc, input, element);
        const haveProp = value !== undefined;

        /* checkout required */
        if (required && !haveProp) {
            showMessage(`Property "${name}" is expected in settings object`, cast);
            continue;
        }

        /* use default */
        if (!haveProp) {
            result[name] = defaultValue;
            continue;
        }

        /* checkout types */
        const types = type ? [...oneofTypes, type] : oneofTypes;

        if (types.length && !checkoutTypes(value, types)) {
            const typeMessage = types.length > 1
                ? `one of types ${printType(types)}`
                : `a type ${printType(types[0])}`;

            showMessage(`Value "${printValue(value)}" of property "${name}" must be ${typeMessage}`, cast);
            continue;
        }

        const output = {};
        if (arrayof && !checkoutArrayTypes(value, arrayof, maxCheckLength, output)) {
            showMessage(`Value ${output.value} of property "${name}" must be an array of types ${printType(arrayof)}`, cast);
            continue;
        }

        /* checkout available values */
        if (Array.isArray(oneof) && oneof.length && !oneof.includes(value)) {
            showMessage(`Value "${value}" of property "${name}" is unacceptable, it must be one of [${oneof.join()}]`, cast);
            continue;
        }

        /* pass throught filter */
        if (typeof filter === 'function' && !filter(value)) {
            showMessage(`Value "${value}" of property "${name}" can't be passed throught filter`, cast);
            continue;
        }

        result[name] = value;
    }

    return result;
}