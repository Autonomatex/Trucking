import { Router, type IRouter } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const ENTERPRISE_API_TARGET =
  process.env["ENTERPRISE_API_URL"] ?? "http://localhost:8000";

const router: IRouter = Router();

// Reverse-proxies /api/enterprise/* to the standalone FastAPI
// "autonomatex-api" service (native Python service, not a workspace
// artifact). This lets browser clients reach it through the already
// proxied /api path instead of talking to its internal port directly.
router.use(
  "/enterprise",
  createProxyMiddleware({
    target: ENTERPRISE_API_TARGET,
    changeOrigin: true,
    pathRewrite: {
      "^/": "/api/v1/",
    },
  }),
);

export default router;
