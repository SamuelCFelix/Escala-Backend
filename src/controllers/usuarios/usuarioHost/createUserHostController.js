const createUserHost = require("../../../models/usuarios/usuarioHost/createUserHost");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { senha, usuarioPerfilId } = req.body;
      let response = await createUserHost.execute(senha, usuarioPerfilId);

      if (response === "Senha autorizacao incorreta") {
        return res.status(401).json(response);
      } else if (response) {
        return res.status(201).json(response);
      }
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/usuarios/usuarioHost/createUserHostController";
        logger.error("Erro ao criar perfil:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
