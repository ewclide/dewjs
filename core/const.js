import { idGetter, log } from './functions';

const $metaData = Symbol('meta_data');
const getConstValue = idGetter();

function setMetaData(storage, constName, metaData) {
    // const metaStorage = this._store.get(nameSpace);
    const desc = {
        enumerable: true,
        writable: false,
        configurable: false
    };

    let value;

    if (typeof metaData === 'object') {
        value = getConstValue();
        metaData.constName = constName;
        storage.set(value, metaData);
    } else {
        value = metaData;
        storage.set(value, { constName });
    }

    Object.defineProperty(nameSpace, constName, { ...desc, value });
}

function createConst(constList) {
    
}

export default class ConstManager {
    constructor() {
        this._storageMap = new Map();
        this._getConstValue = idGetter();
    }

    has(nameSpace, constValue) {
        const storage = this._storageMap.get(nameSpace);
        const metaData = storage ? storage.get(nameSpace) : null;

        if (metaData) {
            return metaData.has(constValue);
        }

        const found = Object.entries(nameSpace).find(([k, v]) => v === constValue);
        return Boolean(found);
    }

    create(constList) {
        const nameSpace = {};
        const storage = new Map();

        if (Array.isArray(constList)) {
            constList.forEach(constName => setMetaData(nameSpace, constName));
        }

        else if (typeof constList === 'object') {
            const entries = Object.entries(constList);

            for (const [constName, metaData] of entries) {
                setMetaData(nameSpace, constName, metaData);
            }
        }

        this._storageMap.set(nameSpace, storage);

        return nameSpace;
    }

    getData(nameSpace, value) {
        const warnText = `Constant with value "${value}" have not meta data`;
        const metaData = nameSpace[$metaData];

        if (!metaData) {
            log.warn(warnText);
            return;
        }

        if (!metaData.has(value)) {
            log.warn(warnText);
            return;
        }

        return metaData.get(value);
    }

    static getName(nameSpace, constValue) {
        const emptyConstError = `Can't get constant name by value "${constValue}" from nameSpace ${nameSpace}`;
        const metaData = nameSpace[$metaData];

        if (metaData) {
            if (!metaData.has(constValue)) {
                log.error(emptyConstError);
                return;
            }

            return metaData.get(constValue).constName;
        }

        const found = Object.entries(nameSpace).find(([k, v]) => v === constValue);

        if (!found) {
            log.error(emptyConstError);
            return;
        }

        return found[0];
    }

    erase() {

    }
}