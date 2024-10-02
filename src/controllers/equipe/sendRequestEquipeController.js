const sendRequestEquipe = require("../../models/equipe/sendRequestEquipe");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId, equipeId } = req.body;

      let response = await sendRequestEquipe.execute(usuarioId, equipeId);

      return res.status(201).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/equipe/sendRequestEquipeController";
        logger.error("Erro ao enviar solicitação para equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
