const loginAuth = require("../../models/login/loginAuth");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const { email, senha } = req.body;
      let response = await loginAuth.execute(email, senha, res);

      if (response.token) {
        return res.status(200).json(response);
      } else {
        return res.status(401).json(response);
      }
    } catch (error) {
      if (!error.path) {
        error.path = "/controllers/login/loginAuthController";
        logger.error("Erro ao fazer login:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
