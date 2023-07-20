require("dotenv").config();

const colors = require("chalk");
const { format } = require("date-fns");

const { DEBUG } = process.env;

const styles = {
    debug: colors.yellow,
    error: colors.bgRed.white.bold,
    warn: colors.bgYellow.blue,
    info: colors.blue.bold,
    log: colors.grey
};

module.exports = {
    colors,
    styles,

    output(message) {
        console.log(message);
    },

    build(message, tag) {
        const stamp = format(new Date(), "yyyy-MM-dd HH:mm:ss.SSS");

        return `[${stamp} ${tag}]: ${message.join(" ")}`;
    },

    debug(...message) {
        const keywords = ["Sleep", "Wait"];

        if (DEBUG && keywords.some((word) => DEBUG.includes(word))) {
            this.output(styles.debug(this.build(message, "Sleep DEBUG")));
        }
    },

    error(...message) {
        this.output(styles.error(this.build(message, "Sleep")));
    },

    warn(...message) {
        this.output(styles.warn(this.build(message, "Sleep")));
    },

    info(...message) {
        this.output(styles.info(this.build(message, "Sleep")));
    },

    log(...message) {
        this.output(styles.log(this.build(message, "Sleep")));
    }
};
