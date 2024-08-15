const findEscalacoesUsuario = require("../../../models/geral/tabelaInformacoes/findEscalacoesUsuario");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId, usuarioId } = req.body;

      let response = await findEscalacoesUsuario.execute(equipeId, usuarioId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaInformacoes/findEscalacoesUsuarioController";
        logger.error("Erro ao buscar escala do membro da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
