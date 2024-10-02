const findConfigHome = require("../../models/home/findConfigHome");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { usuarioId } = req.body;

      let response = await findConfigHome.execute(usuarioId);

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/home/findConfigHomeController";
        logger.error("Erro ao buscar informações iniciais:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
