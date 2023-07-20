
const { exit } = require("process");
const path = require("path");

const { output } = require("codeceptjs");
const { setHeadlessWhen, setCommonPlugins } = require("@codeceptjs/configure");

const GatherBddSteps = require("./probe/utils/GatherBddSteps");
const Bootstrap = require("./probe/utils/Bootstrap");

const CASE_LIST_FILE = "./case-list.txt";

// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
    output: "./output/probe",
    helpers: {
        Playwright: {
            // require: "./helpers/playwright.js",
            url: "http://localhost",
            show: false,
            browser: "chromium",
            waitForNavigation: "networkidle0",
            windowSize: "800x600",
            waitForTimeout: 60000,
            disableScreenshots: false,
            uniqueScreenshotNames: true,
            chromium: {
                args: [
                    "--disable-setuid-sandbox",
                    "--deterministic-fetch",
                    "--no-sandbox",
                    "--ipc=host"
                ]
            }
        },
        REST: {
            endpoint: "http://localhost:3000/api",
            prettyPrintJson: true,
            onRequest: (request) => {
                request.headers.auth = "123";
                output.log(request);
            }
        },
        ChaiHelper: {
            require: "./probe/helpers/chai.js"
        },
        Mochawesome: {
            uniqueScreenshotNames: true
        }
    },
    include: {
        I: "./probe/steps/custom.js",
        Table: "./probe/pages/Table.js",
        NavigateByClick: "./probe/pages/NavigateByClick.js",
        NavigateByUrl: "./probe/pages/NavigateByUrl.js"
    },
    mocha: {
        reporterOptions: {
            outputreportDirDir: `${__dirname}/output/mochawesome`
        }
    },
    plugins: {
        screenshotOnFail: {
            enabled: true
        },
        skipHook: {
            require: "./probe/utils/skip.js",
            enabled: true
        },
        allure: {
            outputDir: `${__dirname}/output/allure`,
            require: "@codeceptjs/allure-legacy"
        }
    },
    bootstrap: async function () {
        // logger and output doesn't seem to work at this point, use console.log
        // eslint-disable-next-line no-console
        console.log(`Selective? [${process.env.SELECTIVE}]`);
        if (
            process.env.SELECTIVE &&
    process.env.SELECTIVE.toLowerCase().toString() === "true"
        ) {
            // TODO: maybe an env var provided list?
            const listFile = path.join(__dirname, CASE_LIST_FILE);
            const suiteStrap = new Bootstrap(listFile);
            suiteStrap.build();
        }
        return null;
    },
    teardown: function () {
        console.log("No teardown");
        exit();
    },
    gherkin: {
        features: "./probe/features/**/*.feature",
        steps: GatherBddSteps.findSteps(__dirname, "probe/step_definitions")
    },
    tests: "./probe/tests/**/*.test.js",
    name: "marina"
};
