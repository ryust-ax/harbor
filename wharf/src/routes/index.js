const uiRoutes = require("./ui");
const apiRoutes = require("./api");

module.exports = {
    ...uiRoutes,
    ...apiRoutes
};
