const { inspect } = require("util");

const { output } = require("codeceptjs");

const Recursive = require("./Recursive");
const Store = require("./Store");
const Sleep = require("./Sleep");

class Common {
    static Recursive = Recursive;

    static Store = Store;

    static Sleep = Sleep;

    static ucFirst(rawString) {
        if (!rawString) {
            return "";
        }

        return `${rawString[0].toUpperCase()}${rawString.slice(1)}`;
    }

    static selectRandom(collection) {
        output.log(`To pick from: [${inspect(collection, { depth: 3 })}]`);

        // Pick random from options
        // - sort in random 'lowest' order ()
        // - return an array of a single-element
        // - https://stackoverflow.com/a/38571132/3298496
        const baseFactor = 0.5;
        const [random] = collection
            .sort(() => baseFactor - Math.random())
            .slice(0, 1);
        return random;
    // In a future edit:
    // countries[Math.abs(Math.floor(Math.random() * countries.length))];
    }

    /**
   * Selecting random item from a list,
   * include only options where inclusionQualifier is true
   * @param {array} fullOptionSet
   * @param {function::boolean} inclusionQualifier
   */
    static selectRandomXor(fullOptionSet, inclusionQualifier) {
        const alternatives = fullOptionSet.filter((option) => {
            return inclusionQualifier(option);
        });

        return Common.selectRandom(alternatives);
    }

    static filterHaystackNeedles(haystack, needles) {
        const found = needles.some((needle) => {
            return haystack.toLowerCase().includes(needle);
        });
        if (found) {
            return true;
        }
        return false;
    }
}

module.exports = Common;
