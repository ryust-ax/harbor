"use strict";

const CodeceptJsChai = require("codeceptjs-chai");
const chai = require("chai");

const { expect } = chai;

class ChaiHelper extends CodeceptJsChai {
    /**
   * Compare values using chai's expect.to.be.equal
   * @param actual
   * @param expected
   * @returns boolean
   */
    seeEquals(actual, expected, msg = "") {
        expect(actual).to.be.equal(expected, msg);
    }
}

module.exports = ChaiHelper;
