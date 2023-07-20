class Store {
    constructor() {
        this._entries = [];
    }

    get entries() {
        return this._entries;
    }

    /**
   * Look for a value.  If store is flat, it will look up if the entry
   * contains that value.  If store is a set of objects, provide a filtering
   * function where the first argument is the value and the second argument
   * if the entry representation
   * eg: has("Tim", (value, item) => item.name === value);
   *
   * @param {*} value
   * @param {*} filterFunction
   * @returns
   */
    has(value, filterFunction) {
        if (filterFunction) {
            return this._entries.find((item) => {
                return filterFunction(value, item);
            });
        }

        return this._entries.includes(value);
    }

    /**
   * Set entire store back to an empty array
   */
    clear() {
        this._entries = [];
    }

    /**
   * Essentially an array.push
   *
   * @param {*} entry
   */
    add(entry) {
        if (Array.isArray(entry)) {
            throw new TypeError("Do not provide an array as addition to Store");
        }

        this._entries.push(entry);
    }

    /**
   * Provide a target value and then a function which if-true, will
   * remove the target value from the associated store
   * eg: has("Tim", (value, item) => item.name === value);
   *    Will remove any entry if the entry's name property value is "Tim"
   *
   * @param {*} entry
   * @param {*} filterFunction
   */
    remove(entry, filterFunction) {
        if (Array.isArray(entry)) {
            throw new TypeError("Do not provide an array as subtraction to Store");
        }

        this._entries = this._entries.filter((item) => {
            return !filterFunction(entry, item);
        });
    }
}

module.exports = Store;
