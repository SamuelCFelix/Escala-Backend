const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioPerfilId) {
    try {
      const response = await client.$transaction(async (client) => {
        const perfil = await client.perfil.findFirst({
          where: {
            id: usuarioPerfilId,
          },
          select: {
            primeiroAcesso: true,
          },
        });

        if (perfil.primeiroAcesso === true) {
          const updatePerfil = await client.perfil.update({
            where: {
              id: usuarioPerfilId,
            },
            data: {
              primeiroAcesso: false,
              updateAt: new Date(),
            },
          });

          const createUsuarioDefault = await client.usuarioDefault.create({
            data: {
              nome: updatePerfil.nome,
              perfilId: usuarioPerfilId,
            },
          });

          await client.escalaUsuarioDefault.create({
            data: {
              usuarioDefaultId: createUsuarioDefault.id,
            },
          });

          const perfilDefaultUser = await client.perfil.findFirst({
            where: {
              id: usuarioPerfilId,
            },
            select: {
              id: true,
              nome: true,
              email: true,
              dataNascimento: true,
              termos: true,
              primeiroAcesso: true,
            },
          });

          return {
            usuarioDefaultId: createUsuarioDefault.id,
            nome: perfilDefaultUser.nome,
            email: perfilDefaultUser.email,
            dataNascimento: perfilDefaultUser.dataNascimento,
            termos: perfilDefaultUser.termos,
            primeiroAcesso: perfilDefaultUser.primeiroAcesso,
            equipeId: "sem equipe",
          };
        } else {
          throw {
            status: 400,
            message: "Perfil já possui um Usuário Default cadastrado!",
          };
        }
      });
      return response;
    } catch (error) {
      error.path = "/models/usuarios/usuarioDefault/createUserDefault";
      logger.error("Erro ao criar Usuário Default:", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
