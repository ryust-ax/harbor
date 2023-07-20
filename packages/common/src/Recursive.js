const Sleep = require("./Sleep");

const { output } = require("codeceptjs");

const MAX_PROCESSING_ATTEMPTS = 5;
const DEFAULT_RETRY_WAIT_SECONDS = 1;

class Recursive {
    retrySeconds = DEFAULT_RETRY_WAIT_SECONDS;

    maxAttempts = MAX_PROCESSING_ATTEMPTS;

    async wait(attempts, split = 0, scale = true) {
        await Sleep.backoff(this.retrySeconds, attempts, split, scale);
    }

    checkExceeded(attempts) {
        if (attempts > this.maxAttempts) {
            output.error(`Attempts [${attempts}] exceeded max [${this.maxAttempts}]`);
            throw new Error(
                `Attempts [${attempts}] exceeded max [${this.maxAttempts}]`
            );
        }
    }

    hasExceeded(attempts) {
        if (attempts > this.maxAttempts) {
            output.log(`Attempts [${attempts}] exceeded max [${this.maxAttempts}]`);
            return true;
        }
        return false;
    }
}

module.exports = Recursive;
