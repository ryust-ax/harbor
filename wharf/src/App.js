const path = require("path");

const express = require("express");

const routes = require("./routes");

class Setup {
    static port = 8080;

    app = express();

    constructor(port) {
        this.port = port || Setup.port;

        this.app.set("view engine", "ejs");
        this.app.set("views", path.join(__dirname, "views"));

        const stylePath = path.join(__dirname, "..", "public", "styles");
        this.app.use("/styles", express.static(stylePath));
    }

    setRoutes() {
        Object.entries(routes).forEach(([route, handler]) => {
            console.log("Loading route", route);
            handler(this.app);
        });
    }

    run() {
        this.app.listen(this.port, () => {
            console.log("Listening...");
        });
    }
}

module.exports = Setup;
