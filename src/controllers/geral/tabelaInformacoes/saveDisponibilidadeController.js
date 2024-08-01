const saveDisponibilidade = require("../../../models/geral/tabelaInformacoes/saveDisponibilidade");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId, disponibilidade, host } = req.body;

      let response = await saveDisponibilidade.execute(
        usuarioId,
        disponibilidade,
        host
      );

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaInformacoes/saveDisponibilidadeController";
        logger.error("Erro ao buscar tags de membro da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
