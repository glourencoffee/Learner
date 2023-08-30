import { Router } from 'express';
import * as controllers from '../controllers/topic';

const router = Router();

router.get    ('/',         controllers.getTopics); 
router.post   ('/',         controllers.createTopic);
router.put    ('/:topicId', controllers.updateTopic);
router.get    ('/:topicId', controllers.getTopic); 
router.delete ('/:topicId', controllers.deleteTopic);

export default router;