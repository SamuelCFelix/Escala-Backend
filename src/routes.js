const { Router } = require("express");
const tokenAuthentication = require("./services/tokenAuthentication");

const createPerfilController = require("./controllers/perfil/createPerfilController");
const loginAuthController = require("./controllers/login/loginAuthController");
const createUserHostController = require("./controllers/usuarios/usuarioHost/createUserHostController");
const createEquipeController = require("./controllers/equipe/createEquipeController");

const routes = Router();

routes.post("/createPerfil", createPerfilController.handle);
routes.post("/loginAuth", loginAuthController.handle);

//Usuarios
routes.post("/usuario/createUsuarioHost", createUserHostController.handle);

//Equipes
routes.post("/criarEquipe", createEquipeController.handle);

module.exports = routes;
