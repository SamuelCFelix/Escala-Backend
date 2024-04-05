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
            id: true,
            nome: true,
            email: true,
            dataNascimento: true,
            termos: true,
            primeiroAcesso: true,
            senha: true,
          },
        });

        if (loginEmailExist) {
          const comparePassword = await comparePasswords(
            senha,
            loginEmailExist.senha
          );
          if (comparePassword) {
            let logsReturn;
            const token = await generateJWT(loginEmailExist.id);

            if (loginEmailExist?.primeiroAcesso === true) {
              return (logsReturn = {
                usuarioPerfilId: loginEmailExist.id,
                token: token,
                nome: loginEmailExist.nome,
                email: loginEmailExist.email,
                dataNascimento: loginEmailExist.dataNascimento,
                termos: loginEmailExist.termos,
                primeiroAcesso: loginEmailExist.primeiroAcesso,
              });
            } else {
              const usuarioHost = await client.usuarioHost.findFirst({
                where: {
                  perfilId: loginEmailExist.id,
                },
                select: {
                  id: true,
                  Equipe: {
                    select: {
                      id: true,
                      nome: true,
                    },
                  },
                },
              });
              return (logsReturn = {
                usuarioHostId: usuarioHost.id,
                token: token,
                nome: loginEmailExist.nome,
                email: loginEmailExist.email,
                dataNascimento: loginEmailExist.dataNascimento,
                termos: loginEmailExist.termos,
                primeiroAcesso: loginEmailExist.primeiroAcesso,
                equipe: usuarioHost.Equipe,
              });
            }
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
