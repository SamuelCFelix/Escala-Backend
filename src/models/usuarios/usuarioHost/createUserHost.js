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

          const createUsuarioHost = await client.usuarioHost.create({
            data: {
              nome: updatePerfil.nome,
              autorizacao: "adm001",
              perfilId: usuarioPerfilId,
            },
          });

          await client.escalaUsuarioHost.create({
            data: {
              usuarioHostId: createUsuarioHost.id,
            },
          });

          const perfilHostUser = await client.perfil.findFirst({
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
            usuarioHostId: createUsuarioHost.id,
            nome: perfilHostUser.nome,
            email: perfilHostUser.email,
            dataNascimento: perfilHostUser.dataNascimento,
            termos: perfilHostUser.termos,
            primeiroAcesso: perfilHostUser.primeiroAcesso,
            equipe: ["sem equipe"],
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
