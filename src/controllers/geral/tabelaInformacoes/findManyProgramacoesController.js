const findManyProgramacoes = require("../../../models/geral/tabelaInformacoes/findManyProgramacoes");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId } = req.body;

      let response = await findManyProgramacoes.execute(equipeId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaInformacoes/findManyProgramacoesController";
        logger.error("Erro ao buscar tags de membro da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
