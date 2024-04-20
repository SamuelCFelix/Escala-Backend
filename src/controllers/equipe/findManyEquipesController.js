const findManyEquipes = require("../../models/equipe/findManyEquipes");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      let response = await findManyEquipes.execute();

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/equipe/findManyEquipesController";
        logger.error("Erro ao buscar equipes:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
