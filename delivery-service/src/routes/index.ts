import express from 'express';
import routesV1 from './v1'
import CommonController from '@controllers/common.controller';
const router = express.Router({ mergeParams: true });

router.get("/", CommonController.index);
router.get("/health", CommonController.health);

router.use("/v1", routesV1)

export default router;