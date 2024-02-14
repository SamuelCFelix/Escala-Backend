const { Router } = require("express");
const tokenAuthentication = require("./services/tokenAuthentication");

const createPerfilController = require("./controllers/perfil/createPerfilController");
const loginAuthController = require("./controllers/login/loginAuthController");

const routes = Router();

routes.post("/token", authTokenController.handle);
routes.post("/createPerfil", createPerfilController.handle);
routes.post("/loginAuth", loginAuthController.handle);

module.exports = routes;
