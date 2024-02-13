const { Router } = require("express");
const createPerfilController = require("./controllers/perfil/createPerfilController");
const loginAuthController = require("./controllers/login/loginAuthController");
const authTokenController = require("./controllers/authTokenController");

const routes = Router();

routes.post("/token", authTokenController.handle);
routes.post("/createPerfil", createPerfilController.handle);
routes.post("/loginAuth", loginAuthController.handle);

module.exports = routes;
