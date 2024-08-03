const gerarEscalaMensal = require("../../../models/equipe/tabelaEscalaMensal/gerarEscalaMensal");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId } = req.body;

      let response = await gerarEscalaMensal.execute(equipeId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/equipe/tabelaEscalaMensal/gerarEscalaMensalController";
        logger.error("Erro ao gerar escala mensal da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
