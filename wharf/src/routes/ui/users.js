const Page = require("../../models/Page");
const MockUsers = require("../../data/MockUsers");

module.exports = (app) => {
    const usersPage = new Page(app, "/users");
    usersPage.render("users.ejs", { users: MockUsers.data });
};
