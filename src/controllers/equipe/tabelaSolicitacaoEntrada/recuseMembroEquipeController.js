const recuseMembroEquipe = require("../../../models/equipe/tabelaSolicitacaoEntrada/recuseMembroEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId, equipeId } = req.body;

      let response = await recuseMembroEquipe.execute(usuarioId, equipeId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/equipe/tabelaSolicitacaoEntrada/recuseMembroEquipeController";
        logger.error("Erro ao recusar membro na equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
