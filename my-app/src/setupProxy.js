const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/ajax",
    createProxyMiddleware({
      target: "https://www.maoyan.com",
      changeOrigin: true,
    })
  );
};
