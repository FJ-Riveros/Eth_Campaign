const routes = require("next-routes")();

//routes.add("URL", "path to the file that we want to reference");
routes.add("/campaigns/new", "/campaigns/new");
routes.add("/campaigns/:address", "/campaigns/show");
routes.add("/campaigns/:address/requests", "/campaigns/requests/index");
routes.add("/campaigns/:address/requests/new", "/campaigns/requests/new");
module.exports = routes;
