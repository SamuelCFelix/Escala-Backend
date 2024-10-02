const { PrismaClient } = require("@prisma/client");
const logger = require("../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(usuarioId) {
    try {
      let infoUsuario = await client.usuarios.findFirst({
        where: {
          id: usuarioId,
        },
        select: {
          id: true,
          foto: true,
          nome: true,
          statusUsuario: true,
          equipeId: true,
          autorizacao: true,
        },
      });

      if (infoUsuario) {
        infoUsuario.usuarioId = infoUsuario.id;
        delete infoUsuario.id;
      }

      return infoUsuario;
    } catch (error) {
      error.path = "/models/home/findConfigHome";
      logger.error("Erro ao buscar informações iniciais da Home", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
