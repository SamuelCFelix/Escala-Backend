const jwt = require("jsonwebtoken");
const logger = require("../custom/logger");
require("dotenv").config();

// Chave secreta para assinar os tokens JWT
const secretKey = process.env.TOKEN_SECRET_KEY;

module.exports = {
  async handle(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: "Token não fornecido" });
      }

      const parts = authHeader.split(" ");

      if (parts.length !== 2) {
        return res.status(401).json({ error: "Token mal formatado" });
      }

      const [scheme, token] = parts;

      if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: "Token mal formatado" });
      }

      jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).json({ error: "Token inválido" });

        req.userId = decoded.userId;
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
