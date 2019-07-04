import { idGetter, log } from './functions';

const $key = Symbol('key');
const $defaultKey = Symbol('default_key');
const metaDataStorage = new Map();
const getConstValue = idGetter();

function _setMetaData(nameSpace, constName, metaData = {}) {
    const storage = metaDataStorage.get(nameSpace);
    const value = getConstValue();
    const desc = {
        enumerable: true,
        writable: false,
        configurable: false
    };

    metaData.constName = constName;
    storage.set(value, metaData);

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

function create(constList, key_ = $defaultKey) {
    let key = key_;

    if (key_ && typeof key_ != 'symbol') {
        log.warn(`key "${key_}" must be a Symbol. Now constant meta-data not private`);
        key = $defaultKey;
    }

    const nameSpace = { [$key]: key };
    const storage = new Map();

    if (Array.isArray(constList)) {
        constList.forEach(constName => _setMetaData(nameSpace, constName));
    }

    else if (typeof constList === 'object') {
        const entries = Object.entries(constList);

        for (const [constName, metaData] of entries) {
            _setMetaData(nameSpace, constName, metaData);
        }
    }

    metaDataStorage.set(nameSpace, storage);

    return nameSpace;
}

function getData(nameSpace, value, key = $defaultKey) {
    if (nameSpace[$key] !== key) {
        log.error(`Can't get access to meta-data of const with value "${value}" from namespace "${nameSpace}"`);
        return;
    }

    const warnText = `Constant with value "${value}" have not meta-data`;
    const storage = metaDataStorage.get(nameSpace);

    if (!storage) {
        log.warn(warnText);
        return;
    }

    if (!storage.has(value)) {
        log.warn(warnText);
        return;
    }

    return storage.get(value);
}

function getName(nameSpace, constValue) {
    const emptyConstError = `Can't get constant name by value "${constValue}" from namespace "${nameSpace}"`;
    const storage = metaDataStorage.get(nameSpace);

    if (storage) {
        if (!storage.has(constValue)) {
            log.error(emptyConstError);
            return;
        }

        return storage.get(constValue).constName;
    }

    const found = Object.entries(nameSpace).find(([k, v]) => v === constValue);

    if (!found) {
        log.error(emptyConstError);
        return;
    }

    return found[0];
}

function erase(nameSpace) {
    log.warn(`Meta-data of namespace "${nameSpace}" was erased`);
    metaDataStorage.delete(nameSpace);
}

export default {
    has,
    create,
    getData,
    getName,
    erase
}