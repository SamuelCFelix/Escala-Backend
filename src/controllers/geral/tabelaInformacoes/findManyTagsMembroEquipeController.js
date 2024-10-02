const findManyTagsMembroEquipe = require("../../../models/geral/tabelaInformacoes/findManyTagsMembroEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId } = req.body;

      let response = await findManyTagsMembroEquipe.execute(usuarioId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaInformacoes/findManyTagsMembroEquipeController";
        logger.error("Erro ao buscar tags de membro da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
