const env = {
  host: process.env.HOST || "localhost",
  port: Number(process.env.PORT || 8080),
  nodeEnv: process.env.NODE_ENV || "development",
};

module.exports = { env };
