const { Router } = require("express");
const tokenAuthentication = require("./services/tokenAuthentication");

const createPerfilController = require("./controllers/perfil/createPerfilController");
const loginAuthController = require("./controllers/login/loginAuthController");
const createUserHostController = require("./controllers/usuarios/usuarioHost/createUserHostController");
const createEquipeController = require("./controllers/equipe/createEquipeController");
const createUserDefaultController = require("./controllers/usuarios/usuarioDefault/createUserDefaultController");
const findManyEquipesController = require("./controllers/equipe/findManyEquipesController");
const requestEquipeController = require("./controllers/equipe/requestEquipeController");
const findConfigHomeController = require("./controllers/home/findConfigHomeController");
const findManyRequestEquipeController = require("./controllers/equipe/tabelaSolicitacaoEntrada/findManyRequestEquipeController");
const acceptMembroEquipeController = require("./controllers/equipe/tabelaSolicitacaoEntrada/acceptMembroEquipeController");
const recuseMembroEquipeController = require("./controllers/equipe/tabelaSolicitacaoEntrada/recuseMembroEquipeController");
const findManyMembrosEquipeController = require("./controllers/equipe/tabelaMinhaEquipe/findManyMembrosEquipeController");
const findManyTagsEquipeController = require("./controllers/equipe/tabelaMinhaEquipe/findManyTagsEquipeController");
const expulsarMembroEquipeController = require("./controllers/equipe/perfilEquipe/expulsarMembroEquipeController");
const updateMembroAdmEquipeController = require("./controllers/equipe/perfilEquipe/updateMembroAdmEquipeController");
const updateStatusMembroEquipeController = require("./controllers/equipe/perfilEquipe/updateStatusMembroEquipeController");
const updateTagsMembroEquipeController = require("./controllers/equipe/perfilEquipe/updateTagsMembroEquipeController");
const findManyTagsMembroEquipeController = require("./controllers/geral/tabelaInformacoes/findManyTagsMembroEquipeController");
const findManyProgramacoesController = require("./controllers/geral/tabelaInformacoes/findManyProgramacoesController");

const routes = Router();

routes.post("/createPerfil", createPerfilController.handle);
routes.post("/loginAuth", loginAuthController.handle);

//Usuarios: Host e Default

//Usuarios Host
routes.post("/usuario/createUsuarioHost", createUserHostController.handle);

//Usuarios Default
routes.post(
  "/usuario/createUsuarioDefault",
  createUserDefaultController.handle
);

//Equipes
routes.post("/criarEquipe", createEquipeController.handle);
routes.get("/buscarEquipes", findManyEquipesController.handle);
routes.post("/solicitacaoEquipe", requestEquipeController.handle);

//Home
routes.post(
  "/informacoesHome",
  tokenAuthentication.handle,
  findConfigHomeController.handle
);

//TAB GERAL

//Tabela Informações

routes.post(
  "/buscarTagsMembroEquipe",
  tokenAuthentication.handle,
  findManyTagsMembroEquipeController.handle
);

routes.post(
  "/buscarProgramacoesEquipe",
  tokenAuthentication.handle,
  findManyProgramacoesController.handle
);

//TAB EQUIPE

//Tabela Solicitações
routes.post(
  "/solicitacoesDeEntrada",
  tokenAuthentication.handle,
  findManyRequestEquipeController.handle
);

routes.put(
  "/aceitarMembroEquipe",
  tokenAuthentication.handle,
  acceptMembroEquipeController.handle
);

routes.delete(
  "/recusarMembroEquipe",
  tokenAuthentication.handle,
  recuseMembroEquipeController.handle
);

//Tabela Minha Equipe
routes.post(
  "/buscarMembrosEquipe",
  tokenAuthentication.handle,
  findManyMembrosEquipeController.handle
);

routes.post(
  "/buscarTagsEquipe",
  tokenAuthentication.handle,
  findManyTagsEquipeController.handle
);

//Perfil
routes.put(
  "/expulsarMembroEquipe",
  tokenAuthentication.handle,
  expulsarMembroEquipeController.handle
);

routes.put(
  "/updateAdmMembroEquipe",
  tokenAuthentication.handle,
  updateMembroAdmEquipeController.handle
);

routes.put(
  "/updateStatusMembroEquipe",
  tokenAuthentication.handle,
  updateStatusMembroEquipeController.handle
);

routes.put(
  "/updateTagsMembroEquipe",
  tokenAuthentication.handle,
  updateTagsMembroEquipeController.handle
);

module.exports = routes;
