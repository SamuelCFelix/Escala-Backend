const findManyMembrosEquipe = require("../../../models/equipe/findManyMembrosEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId } = req.body;

      let response = await findManyMembrosEquipe.execute(equipeId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/equipe/findManyMembrosEquipeController";
        logger.error("Erro ao buscar membros da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
