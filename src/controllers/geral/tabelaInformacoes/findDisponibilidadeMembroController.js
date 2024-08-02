const findDisponibilidadeMembro = require("../../../models/geral/tabelaInformacoes/findDisponibilidadeMembro");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId, host } = req.body;

      let response = await findDisponibilidadeMembro.execute(usuarioId, host);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaInformacoes/findDisponibilidadeMembroController";
        logger.error(
          "Erro ao buscar disponibilidade de membro da equipe:",
          error
        );
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
