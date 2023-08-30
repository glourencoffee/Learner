import { Router } from 'express';
import knowledgeAreaRouter from './knowledgeArea';
import topicRouter from './topic';

const router = Router();

router.use('/knowledgearea', knowledgeAreaRouter);
router.use('/topic',         topicRouter);

export default router;