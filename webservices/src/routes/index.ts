import { Router } from 'express';
import knowledgeAreaRouter from './knowledgeArea';

const router = Router();

router.use('/knowledgearea', knowledgeAreaRouter);

export default router;