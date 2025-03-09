import packetController from '@controllers/packet.controller';
import express from 'express';

const router = express.Router({ mergeParams: true });


router.post("/packets/reserve", packetController.reserve.bind(packetController) as any);

router.post("/packets/book", packetController.book.bind(packetController) as any);

export default router;