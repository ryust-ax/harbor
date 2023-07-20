module.exports = (app) => {
    app.get("/api", (request, response) => {
        response.send({ hello: "world" });
    });
};
