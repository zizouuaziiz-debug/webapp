const app = require("../server/app").default;

module.exports = function handler(req, res) {
  if (!req.url?.startsWith("/api")) {
    req.url = "/api" + (req.url || "/");
  }
  return app(req, res);
};
