import { Router, type IRouter } from "express";
import healthRouter from "./health";
import enterpriseRouter from "./enterprise";

const router: IRouter = Router();

router.use(healthRouter);
router.use(enterpriseRouter);

export default router;
