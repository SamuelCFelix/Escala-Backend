const { Router } = require("express");
const createPerfilController = require("./controllers/perfil/createPerfilController");

const routes = Router();

routes.post("/createPerfil", createPerfilController.handle);

module.exports = routes;
