import { Router } from 'express';
import * as controllers from '../controllers/answer';

const router = Router();

router.post   ('/',          controllers.createAnswer);
router.get    ('/',          controllers.getAnswers); 
router.delete ('/',          controllers.deleteAnswers);
router.get    ('/:answerId', controllers.getAnswer);
router.delete ('/:answerId', controllers.deleteAnswer);

export default router;