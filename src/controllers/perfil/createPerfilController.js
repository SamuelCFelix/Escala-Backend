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

      return res.status(201).json(response);
    } catch (error) {
      if (!error.path) {
        // Defina a propriedade path do erro
        error.path = "/controllers/perfil/createPerfilController";
        logger.error("Erro ao criar perfil:", error);
      }
      // Retorne uma resposta de erro em qualquer caso
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
