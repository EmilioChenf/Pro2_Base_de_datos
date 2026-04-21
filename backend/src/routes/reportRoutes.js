import { Router } from 'express';

import { dashboard, overview } from '../controllers/reportController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/dashboard', dashboard);
router.get('/overview', overview);

export default router;
