import { Router } from 'express';
import * as controllers from '../controllers/knowledgeArea';

const router = Router();

router.post   ('/toplevel',     controllers.createTopLevelKnowledgeArea);
router.get    ('/toplevel',     controllers.getTopLevelKnowledgeAreas);
router.post   ('/:id',          controllers.createChildKnowledgeArea);
router.put    ('/:id',          controllers.updateKnowledgeArea);
router.get    ('/:id',          controllers.getKnowledgeArea); 
router.delete ('/:id',          controllers.deleteKnowledgeArea);
router.get    ('/:id/children', controllers.getChildrenOfKnowledgeArea);

export default router;