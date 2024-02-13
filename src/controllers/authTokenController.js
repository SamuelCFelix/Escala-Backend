const tokenAuthValidation = require("../models/authToken");
const logger = require("../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { token } = req.body;
      let response = await tokenAuthValidation.execute(token);

      if (response) {
        return res.status(200).json(response);
      } else {
        return res.status(401).json("token inválido");
      }
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/authTokenController";
        logger.error("Erro ao validar token:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
