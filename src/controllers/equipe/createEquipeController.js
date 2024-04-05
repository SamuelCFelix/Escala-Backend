const createEquipe = require("../../models/equipe/createEquipe");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioHostId, nomeEquipe, descricaoEquipe, programacoes, tags } =
        req.body;
      let response = await createEquipe.execute(
        usuarioHostId,
        nomeEquipe,
        descricaoEquipe,
        programacoes,
        tags
      );

      return res.status(201).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/equipe/createEquipeController";
        logger.error("Erro ao criar equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
