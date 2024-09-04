const { PrismaClient } = require("@prisma/client");
const logger = require("../../../custom/logger");
const client = new PrismaClient();

module.exports = {
  async execute(equipeId) {
    try {
      // Busca a programação mensal da equipe
      const buscarEscalaEquipe = await client.equipe.findFirst({
        where: {
          id: equipeId,
        },
        select: {
          escalaMensal: true,
        },
      });

      if (!buscarEscalaEquipe) {
        throw new Error("Equipe não encontrada");
      }

      if (buscarEscalaEquipe.escalaMensal !== null) {
        let escalaMensal = JSON.parse(buscarEscalaEquipe?.escalaMensal);

        // Extrai todos os membros escalados na programação mensal
        let todosEscalados = [];
        escalaMensal.forEach((programacao) => {
          todosEscalados.push(
            ...programacao.escalados?.map((escalado) => escalado.membroId)
          );
        });

        // Remove duplicados e o membroId "sem membro"
        todosEscalados = [...new Set(todosEscalados)]?.filter(
          (membroId) => membroId !== "sem membro"
        );

        // Busca as fotos dos membros únicos
        let fotosUsuarios = await Promise.all(
          todosEscalados?.map(async (membroId) => {
            let usuario = await client.usuarioDefault.findFirst({
              where: { id: membroId },
              select: { id: true, foto: true },
            });

            if (!usuario) {
              usuario = await client.usuarioHost.findFirst({
                where: { id: membroId },
                select: { id: true, foto: true },
              });
            }

            return { membroId: usuario.id, membroFoto: usuario.foto };
          })
        );

        // Retorna a escala mensal e o array com os IDs e fotos dos membros
        return { escalaMensal, fotosUsuarios } || [];
      } else {
        return [];
      }
    } catch (error) {
      error.path = "/models/equipe/tabelaEscalaMensal/findEscalaMensal";
      logger.error("Erro ao buscar escala mensal da equipe model", error);
      throw error;
    } finally {
      await client.$disconnect();
    }
  },
};
