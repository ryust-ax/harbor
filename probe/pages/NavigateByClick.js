const { output } = require("codeceptjs");
const { Recursive, ucFirst } = require("common");

const { I } = inject();

class NavigateByClick extends Recursive {
    async click(buttonText, buttonLocator, destinationPage, attempts = 0) {
        const here = await I.grabCurrentUrl();
        output.log(`Seem to be on [${here}]`);
        output.log(`Want to click navigate to [${destinationPage}]`);
        // might have a problem if "/"
        if (here.includes(destinationPage)) {
            return true;
        }
        output.log(`Try clicking [${buttonText}] [${buttonLocator}][attempts:${attempts}]`);

        await I.click(ucFirst(buttonText), buttonLocator);
        this.checkExceeded(attempts);
        await this.wait(attempts);

        return this.click(buttonText, buttonLocator, destinationPage, attempts + 1);
    }
}

module.exports = new NavigateByClick();
