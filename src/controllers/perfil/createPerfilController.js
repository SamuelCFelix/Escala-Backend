const createPerfil = require("../../models/perfil/createPerfil");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { nome, cpf, dataNascimento, numeroTelefone, email, senha } =
        req.body;
      let response = await createPerfil.execute(
        nome,
        cpf,
        dataNascimento,
        numeroTelefone,
        email,
        senha
      );

      logger.info("Create successfully");

      return res.status(201).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/perfil/createPerfilController";
      }
      throw error;
    }
  },
};
