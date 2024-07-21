const findManyTagsEquipe = require("../../../models/equipe/findManyTagsEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId } = req.body;

      let response = await findManyTagsEquipe.execute(equipeId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/equipe/findManyTagsEquipeController";
        logger.error("Erro ao buscar tags da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
