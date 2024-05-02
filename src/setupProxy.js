const { createProxyMiddleware } = require("http-proxy-middleware")
const backendUrl = process.env.REACT_APP_BACK_API_URL;

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: `${backendUrl}`,
      changeOrigin: true,
    })
  )
}