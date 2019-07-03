import { idGetter } from './functions';

const $metaData = Symbol('meta_data');

export default class ConstantGenerator {
    constructor() {
        this._metaDataStore = new Map();
        this._getConstValue = idGetter();
    }

    has(nameSpace, constValue) {
        const metaData = nameSpace[$metaData];
    
        if (metaData) {
            return metaData.has(constValue);
        }
    
        const found = Object.entries(nameSpace).find(([k, v]) => v === constValue);
        return Boolean(found);
    }

    create(constList) {
        const nameSpace = {
            [this._$metaData]: new Map()
        };
    
        if (Array.isArray(constList)) {
            constList.forEach(constName => thsi._setMetaData(nameSpace, constName));
        }
    
        else if (typeof constList === 'object') {
            const entries = Object.entries(constList);
    
            for (const [constName, metaData] of entries) {
                this._setMetaData(nameSpace, constName, metaData);
            }
        }
    
        return nameSpace;
    }

    getData(nameSpace, value) {
        const warnText = `Constant with value "${value}" have not meta data`;
        const metaData = nameSpace[$metaData];
    
        if (!metaData) {
            console.warn(warnText);
            return;
        }
    
        if (!metaData.has(value)) {
            console.warn(warnText);
            return;
        }
    
        return metaData.get(value);
    }

    getName(nameSpace, constValue) {
        const emptyConstError = `Can't get constant name by value "${constValue}" from nameSpace ${nameSpace}`;
        const metaData = nameSpace[$metaData];
    
        if (metaData) {
            if (!metaData.has(constValue)) {
                printErr(emptyConstError);
                return;
            }
    
            return metaData.get(constValue).constName;
        }
    
        const found = Object.entries(nameSpace).find(([k, v]) => v === constValue);
    
        if (!found) {
            printErr(emptyConstError);
            return;
        }
    
        return found[0];
    }

    static has() {}
    static create() {}
    static getData() {}
    static getName() {}

    _setMetaData(nameSpace, constName, metaData, store) {
        const desc = {
            enumerable: true,
            writable: false,
            configurable: false
        };

        let value;

        if (typeof metaData === 'object') {
            value = getConstValue();
            metaData.constName = constName;
            nameSpace[this._$metaData].set(value, metaData);
        } else {
            value = metaData;
            nameSpace[this._$metaData].set(value, { constName });
        }
    
        Object.defineProperty(nameSpace, constName, { ...desc, value });
    }
}