const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const pageRoutes = require("./routes/page.routes");
const eventRoutes = require("./routes/event.routes");
const notificationRoutes = require("./routes/notification.routes");
const { logRequest } = require("./middleware/logger.middleware");
const { sendJson } = require("./utils/http");

const routes = [
  ...authRoutes,
  ...userRoutes,
  ...postRoutes,
  ...pageRoutes,
  ...eventRoutes,
  ...notificationRoutes,
];

async function handleRequest(req, res) {
  logRequest(req);

  if (req.method === "OPTIONS") return sendJson(res, 200, { ok: true });

  const url = new URL(req.url, "http://localhost");

  try {
    if (url.pathname === "/api/health") {
      return sendJson(res, 200, { ok: true, app: "Feed API" });
    }

    for (const route of routes) {
      const match = url.pathname.match(route.pattern);
      if (route.method === req.method && match) {
        req.params = match.groups || {};
        return route.handler(req, res);
      }
    }

    return sendJson(res, 404, { error: "Route not found." });
  } catch (error) {
    return sendJson(res, 500, { error: error.message });
  }
}

module.exports = { handleRequest };
