"use strict";
// mail verify korar jonno verify.edge akta link dibo..link ta direct na dia hooks dara dibo
const { hooks } = require("@adonisjs/ignitor");

hooks.after.providersBooted(() => {
  const View = use("View");
  const Env = use("Env");
  View.global("appUrl", (path) => {
    const APP_URL = Env.get("APP_URL");
    return path ? `${APP_URL}/${path}` : APP_URL;
  });
});
