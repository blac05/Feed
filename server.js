const http = require("http");
const { handleRequest } = require("./src/app");
const { env } = require("./src/config/env");
const { ensureDb } = require("./src/models/store.model");

ensureDb();

http.createServer(handleRequest).listen(env.port, env.host, () => {
  console.log(`Feed API running at http://${env.host}:${env.port}`);
});
