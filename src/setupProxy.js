const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/coffee/hot",
    createProxyMiddleware({
      target: "https://api.sampleapis.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api/coffee/hot": "/coffee/hot",
      },
    })
  );

  app.use(
    "/api/coffee/iced",
    createProxyMiddleware({
      target: "https://api.sampleapis.com",
      changeOrigin: true,
      pathRewrite: {
        "^/api/coffee/iced": "/coffee/iced",
      },
    })
  );
};