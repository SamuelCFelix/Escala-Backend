const updateStatusMembroEquipe = require("../../../models/equipe/perfilEquipe/updateStatusMembroEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId, acao, host } = req.body;

      let response = await updateStatusMembroEquipe.execute(
        usuarioId,
        acao,
        host
      );

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/equipe/perfilEquipe/updateStatusMembroEquipeController";
        logger.error("Erro ao mudar status do membro da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
