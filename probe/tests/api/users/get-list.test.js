const { inspect } = require("util");

const _ = require("lodash");
const { output } = require("codeceptjs");

const { I } = inject();

Feature("Api Automation");

Scenario(
    "Can place a bdr order @ScenarioB",
    async () => {
        const result = await I.sendGetRequest("/users");
        output.log(inspect(result, { depth: 5 }));
    
        const users = _.get(result, "data.users");
        await I.seeEquals(users.length, 2, "Count of user records returned");
    });
