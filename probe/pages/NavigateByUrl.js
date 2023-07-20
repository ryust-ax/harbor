const { output } = require("codeceptjs");
const { Recursive } = require("common");

const { I } = inject();

/* eslint-disable max-statements */
class NavigateByUrl extends Recursive {
    async goto(page, expected, attempts = 0) {
        expected = expected || page;
        const here = await I.grabCurrentUrl();
        output.log(`Seem to be on [${here}]`);
        output.log(`Might be looking for [${expected}]`);
        if (here.includes(page)) {
            return true;
        }
        if (expected && page.includes(expected)) {
            return true;
        }
        output.log(`Try navigating to [${page}] [attempts:${attempts}]`);

        const url = await I.havePageUrl(page);
        await I.loadPage(url);
        this.checkExceeded(attempts);
        await this.wait(attempts);
        return this.goto(page, expected, attempts + 1);
    }
}
/* eslint-enable max-statements */

module.exports = new NavigateByUrl();
