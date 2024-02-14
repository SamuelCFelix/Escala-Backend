const jwt = require("jsonwebtoken");
require("dotenv").config();

// Chave secreta para assinar os tokens JWT
const secretKey = process.env.TOKEN_SECRET_KEY;

module.exports = {
  async handle(req, res) {
    try {
      const { token } = req.headers["x-access-token"];
      jwt.verify(token, secretKey, (err, decode) => {
        if (err) return res.status(401).end();

        req.userId = decode.userId;
        next();
      });
    } catch (error) {
      if (!error.path) {
        error.path = "/services/tokenAuthentication";
        logger.error("Erro ao validar token:", error);
      }
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  },
};
