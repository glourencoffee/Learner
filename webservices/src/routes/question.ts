import { Router } from 'express';
import * as controllers from '../controllers/question';

const router = Router();

router.get    ('/',            controllers.getQuestions);
router.post   ('/',            controllers.createQuestion);
router.put    ('/:questionId', controllers.updateQuestion);
router.get    ('/:questionId', controllers.getQuestion); 
router.delete ('/:questionId', controllers.deleteQuestion);

export default router;