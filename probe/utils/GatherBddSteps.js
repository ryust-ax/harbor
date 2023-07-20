const fs = require("fs");
const path = require("path");

const { output } = require("codeceptjs");

/**
 * Ideally `codeceptjs-cli` would be used instead of this
 * However, nested files under step_definitions is not
 * possible with that library at this time.
 */
class GatherBddSteps {

    static checkInitialDir(dir) {
        output.log(`Checking directory [${dir}]`);
        try {
            const stats = fs.statSync(dir);
            if (!stats) {
                return false;
            }

            return stats.isDirectory();
        } catch (error) {
            output.error(`Error with directory: ${error}`);
            return false;
        }
    }

    static discoverFiles(startPath, stepPath) {
        const investigationPath = path.join(startPath, stepPath);

        return fs.readdirSync(investigationPath).flatMap((entry) => {
            const entryPath = path.join(investigationPath, entry);

            if (fs.statSync(entryPath).isDirectory()) {
                const nextStepPath = path.join(stepPath, entry);
                return GatherBddSteps.discoverFiles(startPath, nextStepPath);
            }

            /* Relative path is needed for the codecept.conf.js content */
            return path.join(stepPath, entry);
        });
    }

    static findSteps(projectDir, stepDir) {
        output.log(`Scanning for steps in [${stepDir}], looking in [${projectDir}]`);
        const fullStepDir = path.join(projectDir, stepDir);
        if (!GatherBddSteps.checkInitialDir(fullStepDir)) {
            throw new Error(`Steps path ${fullStepDir} not found.`);
        }

        /* Start with project folder and provide the path to step definitions */
        return GatherBddSteps.discoverFiles(projectDir, stepDir)
            .filter((file) => {
                return !/^\..*/.test(file);
            })
            .map((filePath) => {
                return `./${filePath}`;
            });
    }
}

module.exports = GatherBddSteps;
