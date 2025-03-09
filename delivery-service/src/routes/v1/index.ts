import agentController from '@controllers/agent.controller';
import express from 'express';

const router = express.Router({ mergeParams: true });

router.post("/agents/reserve", agentController.reserve.bind(agentController) as any);

router.post("/agents/book", agentController.book.bind(agentController) as any);

export default router;