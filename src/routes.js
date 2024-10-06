const { Router } = require("express");
const tokenAuthentication = require("./services/tokenAuthentication");

const createPerfilController = require("./controllers/perfil/createPerfilController");
const loginAuthController = require("./controllers/login/loginAuthController");
const createUserHostController = require("./controllers/usuarios/usuarioHost/createUserHostController");
const createEquipeController = require("./controllers/equipe/createEquipeController");
const createUserDefaultController = require("./controllers/usuarios/usuarioDefault/createUserDefaultController");
const findManyEquipesController = require("./controllers/equipe/findManyEquipesController");
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
const saveDisponibilidadeController = require("./controllers/geral/tabelaInformacoes/saveDisponibilidadeController");
const findDisponibilidadeMembroController = require("./controllers/geral/tabelaInformacoes/findDisponibilidadeMembroController");
const gerarEscalaMensalController = require("./controllers/equipe/tabelaEscalaMensal/gerarEscalaMensalController");
const findEscalaMensalController = require("./controllers/equipe/tabelaEscalaMensal/findEscalaMensalController");
const findProximaEscalaController = require("./controllers/geral/tabelaProximaEscala/findProximaEscalaController");
const findEscalacoesUsuarioController = require("./controllers/geral/tabelaInformacoes/findEscalacoesUsuarioController");
const findUsuariosDisponiveisEscalaDataController = require("./controllers/equipe/tabelaEscalaMensal/findUsuariosDisponiveisEscalaDataController");
const updateEscalaDataController = require("./controllers/equipe/tabelaEscalaMensal/updateEscalaDataController");
const findProximaEscalaMensalController = require("./controllers/equipe/tabelaEscalaMensal/findProximaEscalaMensalController");
const updateProximaEscalaDataController = require("./controllers/equipe/tabelaEscalaMensal/updateProximaEscalaDataController");
const deleteEscalaDataController = require("./controllers/equipe/tabelaEscalaMensal/deleteEscalaDataController");
const deleteProximaEscalaDataController = require("./controllers/equipe/tabelaEscalaMensal/deleteProximaEscalaDataController");
const sendRequestEquipeController = require("./controllers/equipe/sendRequestEquipeController");
const deleteEquipeController = require("./controllers/equipe/tabelaMinhaEquipe/deleteEquipeController");

const routes = Router();

//Login e Perfil

routes.post("/api/createPerfil", createPerfilController.handle);
routes.post("/api/loginAuth", loginAuthController.handle);

//Usuarios: Host e Default

//Usuarios Host
routes.post(
  "/api/usuario/createUsuarioHost",
  tokenAuthentication.handle,
  createUserHostController.handle
);

//Usuarios Default
routes.post(
  "/api/usuario/createUsuarioDefault",
  tokenAuthentication.handle,
  createUserDefaultController.handle
);

//Equipes
routes.post(
  "/api/criarEquipe",
  tokenAuthentication.handle,
  createEquipeController.handle
);
routes.get(
  "/api/buscarEquipes",
  tokenAuthentication.handle,
  findManyEquipesController.handle
);
routes.post(
  "/api/enviarSolicitacaoEquipe",
  tokenAuthentication.handle,
  sendRequestEquipeController.handle
);

//Home
routes.post(
  "/api/informacoesHome",
  tokenAuthentication.handle,
  findConfigHomeController.handle
);

//TAB GERAL

//Tabela Próxima Escala
routes.post(
  "/api/buscarProximaEscala",
  tokenAuthentication.handle,
  findProximaEscalaController.handle
);

routes.post(
  "/api/buscarUsuariosDisponiveisEscalaData",
  tokenAuthentication.handle,
  findUsuariosDisponiveisEscalaDataController.handle
);

routes.post(
  "/api/updateEscalaData",
  tokenAuthentication.handle,
  updateEscalaDataController.handle
);

routes.post(
  "/api/deleteEscalaData",
  tokenAuthentication.handle,
  deleteEscalaDataController.handle
);

routes.post(
  "/api/updateProximaEscalaData",
  tokenAuthentication.handle,
  updateProximaEscalaDataController.handle
);

routes.post(
  "/api/deleteProximaEscalaData",
  tokenAuthentication.handle,
  deleteProximaEscalaDataController.handle
);

//Tabela Informações

routes.post(
  "/api/buscarTagsMembroEquipe",
  tokenAuthentication.handle,
  findManyTagsMembroEquipeController.handle
);

routes.post(
  "/api/buscarProgramacoesEquipe",
  tokenAuthentication.handle,
  findManyProgramacoesController.handle
);

routes.put(
  "/api/salvarDisponibilidadeMembro",
  tokenAuthentication.handle,
  saveDisponibilidadeController.handle
);

routes.post(
  "/api/buscarDisponibilidadeMembro",
  tokenAuthentication.handle,
  findDisponibilidadeMembroController.handle
);

routes.post(
  "/api/buscarEscalacoesUsuario",
  tokenAuthentication.handle,
  findEscalacoesUsuarioController.handle
);

//TAB EQUIPE

//Tabela Escala Mensal
routes.post(
  "/api/gerarEscalaMensal",
  tokenAuthentication.handle,
  gerarEscalaMensalController.handle
);

routes.post(
  "/api/buscarEscalaMensal",
  tokenAuthentication.handle,
  findEscalaMensalController.handle
);

routes.post(
  "/api/buscarProximaEscalaMensal",
  tokenAuthentication.handle,
  findProximaEscalaMensalController.handle
);

//Tabela Solicitações
routes.post(
  "/api/solicitacoesDeEntrada",
  tokenAuthentication.handle,
  findManyRequestEquipeController.handle
);

routes.put(
  "/api/aceitarMembroEquipe",
  tokenAuthentication.handle,
  acceptMembroEquipeController.handle
);

routes.put(
  "/api/recusarMembroEquipe",
  tokenAuthentication.handle,
  recuseMembroEquipeController.handle
);

//Tabela Minha Equipe
routes.post(
  "/api/buscarMembrosEquipe",
  tokenAuthentication.handle,
  findManyMembrosEquipeController.handle
);

routes.post(
  "/api/buscarTagsEquipe",
  tokenAuthentication.handle,
  findManyTagsEquipeController.handle
);

routes.post(
  "/api/deleteEquipe",
  tokenAuthentication.handle,
  deleteEquipeController.handle
);

//Perfil
routes.put(
  "/api/expulsarMembroEquipe",
  tokenAuthentication.handle,
  expulsarMembroEquipeController.handle
);

routes.put(
  "/api/updateAdmMembroEquipe",
  tokenAuthentication.handle,
  updateMembroAdmEquipeController.handle
);

routes.put(
  "/api/updateStatusMembroEquipe",
  tokenAuthentication.handle,
  updateStatusMembroEquipeController.handle
);

routes.put(
  "/api/updateTagsMembroEquipe",
  tokenAuthentication.handle,
  updateTagsMembroEquipeController.handle
);

module.exports = routes;
