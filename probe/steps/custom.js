const { inspect } = require("util");

const { output } = require("codeceptjs");

const { I } = inject();

module.exports = function () {
    return actor({
        loadPage: async function (url) {
            output.log(`Loading page [${url}]`);
            return await I.amOnPage(url);
        },

        havePageUrl: async function(page = "/", base = "") {
            const targetDomain = base || "http://localhost:3000";
            output.log(
                `Page destination [${page}] at provided domain [${base} || ${targetDomain}]`
            );

            const url = new URL(page, targetDomain);

            output.log(`Portal Page Url Object: ${inspect(url, { depth: 3 })}`);
            output.log(`Portal Page URL [${url.href}]`);

            return url.href;
        }

    });
};
