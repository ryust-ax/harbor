
const MockUsers = require("../../data/MockUsers");

module.exports = (app) => {
    app.get("/api/users", (request, response) => {
        const payload = MockUsers.data;
        response.send({ users: payload });
    });
};
