import log from '../function/log';
import idGetter from '../function/id-getter';

const $accessKey = Symbol('access_key');
const $defaultKey = Symbol('default_key');
const $constName = Symbol('const_name');

const metaDataStorage = new Map();
const getConstValue = idGetter();

function _setMetaData(nameSpace, constName, data) {
    const storage = metaDataStorage.get(nameSpace);
    const value = getConstValue();
    const desc = {
        enumerable: true,
        writable: false,
        configurable: false
    };

    storage.set(value, { data, [$constName]: constName });

    Object.defineProperty(nameSpace, constName, { ...desc, value });
}

function has(nameSpace, constValue) {
    const storage = metaDataStorage.get(nameSpace);

    if (storage) {
        return storage.has(constValue);
    }

    const found = Object.entries(nameSpace).find(([k, v]) => v === constValue);
    return Boolean(found);
}

function create(constList, key = $defaultKey) {
    let accessKey = key;

    if (key && typeof key != 'symbol') {
        log.warn(`key "${key}" must be a Symbol. Now constant meta-data not private`);
        accessKey = $defaultKey;
    }

    const nameSpace = { [$accessKey]: accessKey };
    const storage = new Map();

    metaDataStorage.set(nameSpace, storage);

    if (Array.isArray(constList)) {
        constList.forEach(constName => _setMetaData(nameSpace, constName));
    }

    else if (typeof constList === 'object') {
        const entries = Object.entries(constList);

        for (const [constName, metaData] of entries) {
            _setMetaData(nameSpace, constName, metaData);
        }
    }

    return nameSpace;
}

function getData(nameSpace, value, key = $defaultKey) {
    const accessKey = nameSpace[$accessKey];

    if (accessKey && accessKey !== key) {
        log.error(`Can't get access to meta-data of const with value "${value}" from namespace`, nameSpace);
        return;
    }

    const warnText = `Constant with value "${value}" have not meta-data`;
    const storage = metaDataStorage.get(nameSpace);

    if (!storage) {
        log.warn(warnText);
        return;
    }

    const { data } = storage.get(value);

    if (!data) {
        log.warn(warnText);
        return;
    }

    return data;
}

function getName(nameSpace, constValue) {
    const emptyConstError = [`Can't get constant name by value "${constValue}" from namespace`, nameSpace];
    const storage = metaDataStorage.get(nameSpace);

    if (storage) {
        if (!storage.has(constValue)) {
            log.error(...emptyConstError);
            return;
        }

        return storage.get(constValue)[$constName];
    }

    const found = Object.entries(nameSpace).find(([k, v]) => v === constValue);

    if (!found) {
        log.error(...emptyConstError);
        return;
    }

    return found[0];
}

function erase(nameSpace) {
    delete nameSpace[$accessKey];
    metaDataStorage.delete(nameSpace);

    log.warn('Meta-data of namespace', nameSpace, 'was erased');
}

export default {
    has,
    create,
    getData,
    getName,
    erase
}