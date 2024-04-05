const createPerfil = require("../../models/perfil/createPerfil");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { nome, cpf, dataNascimento, email, senha, termos } = req.body;
      let response = await createPerfil.execute(
        nome,
        cpf,
        dataNascimento,
        email,
        senha,
        termos
      );

      return res.status(201).json(response);
    } catch (error) {
      error.path = "/controllers/perfil/createPerfilController";
      logger.error("Erro ao criar perfil controller:", error);

      // Retorne uma resposta de erro em qualquer caso
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
