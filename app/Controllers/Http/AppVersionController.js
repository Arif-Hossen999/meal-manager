"use strict";
const Env = use("Env");
class AppVersionController {
  async updateVersion({ response }) {
    try {
      const version = Env.get("APP_VERSION");
      return version;
    } catch (error) {
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }
}

module.exports = AppVersionController;
