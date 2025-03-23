import orderController from '@controllers/order.controller';
import express from 'express';

const router = express.Router({ mergeParams: true });


router.post("/orders", orderController.createV2.bind(orderController) as any);

export default router;