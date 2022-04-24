const homeController = require("../controller/HomeController");
module.exports = async function (config) {
    const app = config.app;
    const io = config.io;
    app.get("/", homeController.home(io));
    app.get("/add", homeController.add(io));
    app.get("/edit/:id", homeController.edit(io));
};