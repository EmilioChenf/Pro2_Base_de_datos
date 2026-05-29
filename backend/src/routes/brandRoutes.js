import { Router } from 'express';

import { listBrands } from '../controllers/catalogController.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = Router();

router.get('/', authenticate, authorize('ADMIN', 'GERENTE', 'INVENTARIO', 'CLIENTE'), listBrands);

export default router;
