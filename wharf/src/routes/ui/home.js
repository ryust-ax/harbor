const Page = require("../../models/Page");

module.exports = (app) => {
    const homePage = new Page(app, "/");
    homePage.render("index.ejs");
};
