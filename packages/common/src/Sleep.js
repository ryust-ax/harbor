require("dotenv").config();
const randomstring = require("randomstring");

const {
    NETWORK_THROTTLE_MAX_DELAY_SECONDS,
    NETWORK_THROTTLE_MIN_DELAY_SECONDS,
    NETWORK_START_BACKOFF_ON_ATTEMPT
    // FACTOR_MILLISECONDS_PER_SECOND,
} = process.env;
const output= require("./lib/output");

const millisecondsPerSecond = 1000;

/**
 * During HTTP requests, there can be errors.  Those errors might be of a type
 * allowing a retry or a series of retries afterwhich the request might succeed.
 *
 * The delay can be postponed by providing a "start after this attempt number".
 *
 * Because resolution and execution can get a little weird, the delay will never
 * be 0, but will split the calculated buffer.
 */
class Sleep {
    static randomSeconds(length = 1, divisor = 1) {
        const delay = Number(
            randomstring.generate({ length: length, charset: "numeric" })
        );
        if (delay === 0) {
            return delay;
        }
        return delay / divisor;
    }

    static _calculateMinimumDelay(minBuffer) {
        const envMin =
      minBuffer || Number.parseInt(NETWORK_THROTTLE_MIN_DELAY_SECONDS) || 0;

        return envMin * millisecondsPerSecond;
    }

    static _calculateMaxBuffer(minBuffer, maxBuffer) {
        if (minBuffer || maxBuffer) {
            if (maxBuffer === undefined) {
                return minBuffer;
            }

            if (minBuffer > maxBuffer) {
                return minBuffer;
            }

            return maxBuffer;
        }

        if (NETWORK_THROTTLE_MAX_DELAY_SECONDS) {
            return Number.parseInt(NETWORK_THROTTLE_MAX_DELAY_SECONDS);
        }

        return 1;
    }

    static _calculateMaximumDelay(minBuffer, maxBuffer) {
        output.log(`Delay buffer: min[${minBuffer}] max[${maxBuffer}]`);

        const max = Sleep._calculateMaxBuffer(minBuffer, maxBuffer);
        output.log(`Calculated max buffer: [${max}]`);

        return max * millisecondsPerSecond;
    }

    /**
   * Calculate millisecond delay with an exponential factor
   * Provide a value for the current attempt count
   * Provide a minimum value for seconds delay, default 1
   * Provide a maximum value for seconds delay, default 1
   *
   * @param {integer} attempts
   * @param {integer} minBuffer
   * @param {integer} maxBuffer
   * @returns
   */
    static _calculateBackoffBuffer(attempts, minBuffer, maxBuffer) {
        output.log(`Calculating backoff buffer [min:${minBuffer}][max:${maxBuffer}][count:${attempts}]...`);

        const maxDelay = Sleep._calculateMaximumDelay(minBuffer, maxBuffer);
        output.log(`Max Delay MS [${maxDelay}]`);

        const minDelay = Sleep._calculateMinimumDelay(minBuffer);
        output.log(`Min Delay MS [${minDelay}]`);

        const randomNumber = Math.random();
        output.log(`Random Number [${randomNumber}]`);

        const randomDelay = randomNumber * (maxDelay - minDelay);
        output.log(`Random Delay [${randomDelay}]`);

        const baseDelay = Math.floor(randomDelay);
        output.log(`Base Delay MS [${baseDelay}]`);

        const bufferMs = minDelay + baseDelay;
        output.log(`Buffer Milliseconds [${bufferMs}]`);

        const backoffFactor = attempts * attempts;
        output.log(`Backoff Factor [${backoffFactor}]`);

        const finalBuffer = bufferMs * backoffFactor;
        output.log(`Final Calculated Delay [${finalBuffer}]`);

        return finalBuffer;
    }

    /**
   * Some tiny delay is needed for the process to work; else return full delay
   * Provide the current attempt count
   * Provide the relevant millisecond buffer size
   * Provide a static value for the attempt count at which to start calculating
   *   delays, minimum 1
   *
   * @param {integer} attempts
   * @param {integer} buffer
   * @param {integer} start
   * @returns
   */
    static _calculateOperationalDelay(attempts, buffer, start) {
        const startAttempt = start || NETWORK_START_BACKOFF_ON_ATTEMPT || 1;

        const shortcutFactor = 4;

        output.log(`Attempts [${attempts}] vs starting [${startAttempt}]`);
        if (attempts <= startAttempt) {
            const calculated = Math.ceil(buffer / shortcutFactor);
            const override = 700;
            const result = calculated <= override ? calculated : override;
            output.log(`Less than 'START', try faster [${result}]...`);
            return result;
        }
        /**
     * Normally would prefer:
     * `return Promise.resolve(`No delay`);` or `return 0`
     * However, this doesn't work as ideal, so calculate a shorter buffer
     */

        return buffer;
    }

    /**
   * Sleep for number of seconds
   * Time increases based on number of optional attempts
   * Optionally split the milliseconds
   * Optionally use a flat rather than a curved backoff
   * @param {integer} proposedTime
   * @param {integer} currentAttempts
   * @param {boolean} scale
   */
    static backoff(proposedTime, currentAttempts, split = 0, scale = true) {
        const seconds = proposedTime || 1;
        const attempts = currentAttempts || 1;

        output.log(
            `Backoff provided time and attempts: [${seconds}:${attempts}] (scale: ${scale})`
        );

        const buffer = scale
            ? Sleep._calculateBackoffBuffer(attempts, seconds)
            : seconds * millisecondsPerSecond;

        // output.log(`Calculated buffer: [${buffer}]`);

        const calculated = Sleep._calculateOperationalDelay(attempts, buffer);

        output.log(`Raw delay: [${calculated}]`);

        const delay = split ? calculated / split : calculated;

        output.log(`Sleeping for ${delay}ms`);

        return Sleep.delayProcessing(delay);
    }

    /**
   *
   * @param {integer} delay (milliseconds)
   * @returns
   */
    static delayProcessing(delay) {
        output.log(`Sleeping ${delay}ms...`);
        return new Promise((resolve) => {
            setTimeout(() => {
                output.log("Waking...");
                resolve();
            }, delay);
        });
    }

    /**
   *
   * @param {*} param0 ({seconds:integer})
   */
    static async timer({ seconds = 1 }) {
    // eslint-disable-next-line no-magic-numbers
        const ms = 1000 * seconds;
        output.log(`Waiting for [${seconds}] seconds`);
        await new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    /**
   *
   * @param {integer} seconds
   * @returns
   */
    static delay(seconds) {
        return Sleep.timer({ seconds });
    }
}

module.exports = Sleep;
