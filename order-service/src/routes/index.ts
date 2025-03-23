import express from 'express';
import routesV1 from './v1'
import routesV2 from './v2'
import CommonController from '@controllers/common.controller';
const router = express.Router({ mergeParams: true });

router.get("/", CommonController.index as any);
router.get("/health", CommonController.health as any);

router.use("/v1", routesV1)
router.use("/v2", routesV2)

export default router;