const updateMembroAdmEquipe = require("../../../models/equipe/perfilEquipe/updateMembroAdmEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId, acao } = req.body;

      let response = await updateMembroAdmEquipe.execute(usuarioId, acao);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/equipe/perfilEquipe/updateMembroAdmEquipeController";
        logger.error("Erro ao tornar administrador o membro da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
