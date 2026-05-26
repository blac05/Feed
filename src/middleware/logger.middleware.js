function logRequest(req) {
  const startedAt = new Date().toISOString();
  console.log(`${startedAt} ${req.method} ${req.url}`);
}

module.exports = { logRequest };
