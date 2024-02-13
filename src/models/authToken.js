const logger = require("../custom/logger");
const { tokenValidation } = require("../utils/auth");

module.exports = {
  async execute(token) {
    try {
      tokenValidation(token);
      if (tokenValidation) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (!error.path) {
        error.path = "/models/authToken";
      }
      logger.error("Erro ao validar token", error);
      throw error;
    }
  },
};
