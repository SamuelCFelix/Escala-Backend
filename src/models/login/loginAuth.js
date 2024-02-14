const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const { generateJWT } = require("../../services/generateToken");
const {
  PrismaClientValidationError,
} = require("@prisma/client/runtime/library");

const bcrypt = require("bcrypt");

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

const client = new PrismaClient();

module.exports = {
  async execute(email, senha) {
    try {
      const response = await client.$transaction(async (client) => {
        const loginEmailExist = await client.perfil.findFirst({
          where: {
            email,
          },
          select: {
            senha: true,
            id: true,
          },
        });

        if (loginEmailExist) {
          const comparePassword = await comparePasswords(
            senha,
            loginEmailExist.senha
          );
          if (comparePassword) {
            const token = generateJWT(loginEmailExist.id);
            return token;
          } else {
            return "Credenciais inválidas";
          }
        } else {
          return "Credenciais inválidas";
        }
      });
      return response;
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        error.path = "/models/login/loginAuth";
      }
      logger.error("Erro ao fazer login", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
