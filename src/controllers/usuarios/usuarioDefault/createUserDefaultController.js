const createUserDefault = require("../../../models/usuarios/usuarioDefault/createUserDefault");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioPerfilId } = req.body;
      let response = await createUserDefault.execute(usuarioPerfilId);

      return res.status(201).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/usuarios/usuarioDefault/createUserDefaultController";
        logger.error("Erro ao criar perfil:", error);
      }
      if (error.status === 400) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: "Erro interno do servidor" });
      }
    }
  },
};
