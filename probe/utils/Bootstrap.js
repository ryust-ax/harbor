const fs = require("fs");

const { container } = require("codeceptjs");

/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
/**
 * codeceptjs.output doesn't seem to be ready when this is used in bootstrap();
 * For this reason, use console.log for logging/debugging
 */
class Bootstrap {
    constructor(filePath) {
        this.file = filePath;
    }

    build() {
        const raw = this.getFileList();
        const array = this.transformListToArray(raw);
        const regex = this.transformToRegex(array);
        this.grepToSuite(regex);
    }

    /**
   * Transform string with newline delineation
   * @param {*} fileContents
   * @returns
   */
    transformListToArray(fileContents) {
        console.log(`Transforming contents from [${fileContents}]`);
        if (!fileContents) {
            return [];
        }
        return fileContents.split("\n");
    }

    getFileList(provided) {
        const filePath = provided || this.file;
        if (!filePath) {
            throw new Error("Need a path.");
        }
        console.log(`Getting contents from [${filePath}]`);
        try {
            const resolvedPath = require.resolve(filePath);
            return fs.readFileSync(resolvedPath, "utf8");
        } catch {
            console.error(`File not found: [${filePath}].`);
            return "";
        }
    }

    transformToRegex(testList) {
        if (!Array.isArray(testList)) {
            throw new TypeError("Must provide an array.");
        }
        console.log(`Transforming raw [${testList}]`);
        const cleaned = testList.filter((item) => item);
        console.log(`Transforming clean [${testList}]`);
        const re = cleaned.join("|");
        console.log(`Filtering tests based on [${re}]`);
        return new RegExp(re);
    }

    grepToSuite(regex) {
        console.log(`Creating suite from [${regex}]`);
        const mocha = container.mocha();
        mocha.grep(regex);
    }
}
/* eslint-enable no-console */
/* eslint-enable class-methods-use-this */

module.exports = Bootstrap;
