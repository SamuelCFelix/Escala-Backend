const jwt = require("jsonwebtoken");
require("dotenv").config();

// Chave secreta para assinar os tokens JWT
const secretKey = process.env.TOKEN_SECRET_KEY;

// Função para gerar um token JWT com base no ID do usuário
async function generateJWT(userId) {
  const payload = {
    userId: userId,
  };

  const options = {
    expiresIn: "4h",
  };

  const token = jwt.sign(payload, secretKey, options);

  return token;
}
module.exports = { generateJWT };
