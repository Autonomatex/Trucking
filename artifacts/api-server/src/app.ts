import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import enterpriseRouter from "./routes/enterprise";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());

// Mounted before the JSON/urlencoded body parsers: http-proxy-middleware
// re-streams the raw incoming request to the upstream FastAPI service, but
// if express.json()/urlencoded() already drained that stream, the proxy
// never receives a body and the upstream request hangs waiting for one.
app.use("/api", enterpriseRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
