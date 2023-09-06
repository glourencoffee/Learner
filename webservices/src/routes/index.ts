import { Router } from 'express';
import knowledgeAreaRouter from './knowledgeArea';
import topicRouter from './topic';
import questionRouter from './question';

const router = Router();

router.use('/knowledgearea', knowledgeAreaRouter);
router.use('/topic',         topicRouter);
router.use('/question',      questionRouter);

export default router;