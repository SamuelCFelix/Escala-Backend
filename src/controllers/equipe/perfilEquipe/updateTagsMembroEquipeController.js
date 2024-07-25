const updateTagsMembroEquipe = require("../../../models/equipe/perfilEquipe/updateTagsMembroEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId, tagId, acao, host } = req.body;

      let response = await updateTagsMembroEquipe.execute(
        usuarioId,
        tagId,
        acao,
        host
      );

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/equipe/perfilEquipe/updateTagsMembroEquipeController";
        logger.error("Erro ao atualizar tags do membro da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
