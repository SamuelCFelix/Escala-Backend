const expulsarMembroEquipe = require("../../../models/equipe/perfilEquipe/expulsarMembroEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId } = req.body;

      let response = await expulsarMembroEquipe.execute(usuarioId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/equipe/perfilEquipe/expulsarMembroEquipeController";
        logger.error("Erro ao expulsar membro da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
