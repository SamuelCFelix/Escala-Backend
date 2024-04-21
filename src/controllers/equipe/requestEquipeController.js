const requestEquipe = require("../../models/equipe/requestEquipe");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioDefaultId, equipeId } = req.body;

      let response = await requestEquipe.execute(usuarioDefaultId, equipeId);

      return res.status(201).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/equipe/requestEquipeController";
        logger.error("Erro ao enviar solicitação para equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
