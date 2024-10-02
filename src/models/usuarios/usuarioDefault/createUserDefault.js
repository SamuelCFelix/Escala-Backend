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

          const createUsuarioDefault = await client.usuarios.create({
            data: {
              nome: updatePerfil.nome,
              foto: updatePerfil.foto,
              perfilId: usuarioPerfilId,
            },
          });

          await client.escalaUsuarios.create({
            data: {
              usuarioId: createUsuarioDefault.id,
            },
          });

          const perfilDefaultUser = await client.perfil.findFirst({
            where: {
              id: usuarioPerfilId,
            },
            select: {
              id: true,
              nome: true,
              foto: true,
              email: true,
              dataNascimento: true,
              termos: true,
              primeiroAcesso: true,
            },
          });

          return {
            usuarioId: createUsuarioDefault.id,
            autorizacao: createUsuarioDefault.autorizacao,
            equipeId: createUsuarioDefault.equipeId,
            nome: perfilDefaultUser.nome,
            foto: perfilDefaultUser.foto,
            email: perfilDefaultUser.email,
            dataNascimento: perfilDefaultUser.dataNascimento,
            termos: perfilDefaultUser.termos,
            primeiroAcesso: perfilDefaultUser.primeiroAcesso,
          };
        } else {
          throw {
            status: 400,
            message: "Perfil já possui um usuário cadastrado!",
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
