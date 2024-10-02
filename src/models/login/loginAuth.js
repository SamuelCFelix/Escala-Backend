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
            foto: true,
            email: true,
            dataNascimento: true,
            termos: true,
            primeiroAcesso: true,
            senha: true,
            Usuarios: {
              select: {
                id: true,
              },
            },
          },
        });

        if (loginEmailExist) {
          const comparePassword = await comparePasswords(
            senha,
            loginEmailExist.senha
          );
          if (comparePassword) {
            const token = await generateJWT(loginEmailExist.id);

            if (loginEmailExist?.primeiroAcesso === true) {
              return {
                usuarioPerfilId: loginEmailExist.id,
                autorizacao: null,
                equipeId: null,
                primeiroAcesso: loginEmailExist.primeiroAcesso,
                token: token,
                nome: loginEmailExist.nome,
                foto: loginEmailExist.foto,
                email: loginEmailExist.email,
                dataNascimento: loginEmailExist.dataNascimento,
                termos: loginEmailExist.termos,
              };
            } else {
              const usuarioLogin = await client.usuarios.findFirst({
                where: {
                  perfilId: loginEmailExist.id,
                },
                select: {
                  id: true,
                  equipeId: true,
                  autorizacao: true,
                },
              });

              const infoUsuarioReturn = {
                usuarioId: usuarioLogin.id,
                autorizacao: usuarioLogin.autorizacao,
                equipeId: usuarioLogin.equipeId,
                primeiroAcesso: loginEmailExist.primeiroAcesso,
                token: token,
                nome: loginEmailExist.nome,
                foto: loginEmailExist.foto,
                email: loginEmailExist.email,
                dataNascimento: loginEmailExist.dataNascimento,
                termos: loginEmailExist.termos,
              };

              if (
                !usuarioLogin.equipeId &&
                usuarioLogin.autorizacao !== "adm001"
              ) {
                const solicitacaoEquipe = await client.rlSolicitacoes.findMany({
                  where: {
                    usuarioId: usuarioLogin.id,
                  },
                });

                if (solicitacaoEquipe?.length > 0) {
                  return {
                    ...infoUsuarioReturn,
                    equipeId: "solicitacao enviada",
                  };
                } else {
                  return infoUsuarioReturn;
                }
              } else {
                return infoUsuarioReturn;
              }
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
