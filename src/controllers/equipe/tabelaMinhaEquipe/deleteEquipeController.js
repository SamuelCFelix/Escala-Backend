const deleteEquipe = require("../../../models/equipe/tabelaMinhaEquipe/deleteEquipe");
const logger = require("../../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { equipeId, usuarioHostId, senha } = req.body;

      let response = await deleteEquipe.execute(equipeId, usuarioHostId, senha);

      if (response === "Senha autorizacao incorreta") {
        return res.status(401).json(response);
      } else if (response) {
        return res.status(200).json(response);
      }
    } catch (error) {
      if (!error.path) {
        error.path =
          "/controllers/equipe/tabelaMinhaEquipe/deleteEquipeController";
        logger.error("Erro ao deletar equipe:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
