const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Chave secreta para assinar os tokens JWT
const secretKey = crypto.randomBytes(32).toString("hex");

// Função para gerar um token JWT com base no ID do usuário
function generateJWT(userId) {
  const payload = {
    userId: userId,
  };

  const options = {
    expiresIn: "1h",
  };

  const token = jwt.sign(payload, secretKey, options);

  return token;
}

function tokenValidation(token) {
  try {
    const validation = jwt.verify(token, secretKey);

    if (validation) {
      return true;
    } else {
      return false;
    }
  } catch (erro) {
    console.error("Erro ao verificar o token:", erro);
    return null;
  }
}

module.exports = { generateJWT, tokenValidation };
