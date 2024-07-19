const acceptMembroEquipe = require("../../models/equipe/acceptMembroEquipe");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId, equipeId } = req.body;

      let response = await acceptMembroEquipe.execute(usuarioId, equipeId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/equipe/acceptMembroEquipeController";
        logger.error("Erro ao aceitar membro na equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
