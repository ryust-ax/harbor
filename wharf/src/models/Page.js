class Page {
    constructor(app, route) {
        this.app = app;
        this.route = route;
    }

    render(view, data) {
        this.app.get(this.route, (request, response) => {
            response.render(view, data);
        });
    }
}

module.exports = Page;
