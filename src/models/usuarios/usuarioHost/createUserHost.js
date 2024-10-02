const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(senha, usuarioPerfilId) {
    try {
      const response = await client.$transaction(async (client) => {
        if (senha === process.env.PASSWORD_ACESS_USER_HOST) {
          const updatePerfil = await client.perfil.update({
            where: {
              id: usuarioPerfilId,
            },
            data: {
              primeiroAcesso: false,
              updateAt: new Date(),
            },
          });

          const createUsuarioHost = await client.usuarios.create({
            data: {
              nome: updatePerfil.nome,
              foto: updatePerfil.foto,
              autorizacao: "adm001",
              perfilId: usuarioPerfilId,
            },
          });

          await client.escalaUsuarios.create({
            data: {
              usuarioId: createUsuarioHost.id,
            },
          });

          const perfilHostUser = await client.perfil.findFirst({
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
            usuarioId: createUsuarioHost.id,
            autorizacao: createUsuarioHost.autorizacao,
            equipeId: createUsuarioHost.equipeId,
            nome: perfilHostUser.nome,
            foto: perfilHostUser.foto,
            email: perfilHostUser.email,
            dataNascimento: perfilHostUser.dataNascimento,
            termos: perfilHostUser.termos,
            primeiroAcesso: perfilHostUser.primeiroAcesso,
          };
        } else {
          return "Senha autorizacao incorreta";
        }
      });
      return response;
    } catch (error) {
      error.path = "/models/usuarios/usuarioHost/createUserHost";
      logger.error("Erro ao criar Usuário Host:", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
