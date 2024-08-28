const findUsuariosDisponiveisEscalaData = require("../../../models/geral/tabelaProximaEscala/findUsuariosDisponiveisEscalaData");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId, escalaDataId, tagId, modoEdit, escaladosModoEdit } =
        req.body;

      let response = await findUsuariosDisponiveisEscalaData.execute(
        equipeId,
        escalaDataId,
        tagId,
        modoEdit,
        escaladosModoEdit
      );

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/geral/tabelaProximaEscala/findUsuariosDisponiveisEscalaDataController";
        logger.error("Erro ao buscar usuarios disponíveis da equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
