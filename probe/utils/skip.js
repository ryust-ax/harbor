// const { inspect } = require("util");

const dotenv = require("dotenv");
const { event, output } = require("codeceptjs");

dotenv.config();

// eslint-disable-next-line max-statements
function decideSkip(testTags) {
    // A filter-criteria would be cool but for now, an if/else is simple

    if (!Array.isArray(testTags)) {
        output.log("Tags not an array, don't skip.");
        return false;
    }

    if (testTags.includes("@skip")) {
        output.log("Tags contain [@skip], should skip.");
        return true;
    }

    if (
        process.env.APP_ENVIRONMENT !== "development" &&
    testTags.includes("@stageSkip")
    ) {
        output.log("Tags contain [@stageSkip], should skip on staging.");
        return true;
    }

    output.log("No skip criteria met, should not be skipped.");
    return false;
}

module.exports = function () {
    event.dispatcher.on(event.test.before, function (test) {
        output.log(`Found tags [${test.tags}]`);
        const skipThisTest = decideSkip(test.tags);

        if (skipThisTest) {
            // eslint-disable-next-line func-name-matching
            test.run = function skip() {
                output.log(`Skipping test [${test.tags}]`);
                this.skip();
            };
            return;
        }

        output.log(`Executing test [${test.tags}]`);
    });
};
