const findManyTagsMembrosEquipe = require("../../../models/geral/tabelaInformacoes/findManyTagsMembroEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId, host } = req.body;

      let response = await findManyTagsMembrosEquipe.execute(usuarioId, host);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaInformacoes/findManyTagsMembrosEquipeController";
        logger.error("Erro ao buscar tags de membro da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
