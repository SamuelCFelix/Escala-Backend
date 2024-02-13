const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const { generateJWT } = require("../../utils/auth");
const {
  PrismaClientValidationError,
} = require("@prisma/client/runtime/library");

const bcrypt = require("bcrypt");

async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

const client = new PrismaClient();

module.exports = {
  async execute(email, senha, res) {
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
            res.cookie("token", token, { httpOnly: true });
            return { token };
          } else {
            return { error: "Credenciais inválidas" };
          }
        } else {
          return { error: "Credenciais inválidas" };
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
