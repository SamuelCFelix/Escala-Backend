const saveDisponibilidade = require("../../../models/geral/tabelaInformacoes/saveDisponibilidade");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId, disponibilidadeProximoMes } = req.body;

      let response = await saveDisponibilidade.execute(
        usuarioId,
        disponibilidadeProximoMes
      );

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaInformacoes/saveDisponibilidadeController";
        logger.error("Erro salvar disponibilidade de membro da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
