const gerarEscalaManual = require("../../models/manualmente/gerarEscalaManual");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { programacoes, usuarios } = req.body;

      let response = await gerarEscalaManual.execute(programacoes, usuarios);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/manualmente/gerarEscalaManualController";
        logger.error("Erro ao gerar escala manualmente da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
