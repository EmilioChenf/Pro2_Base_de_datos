import { Router } from 'express';

import { listBrands } from '../controllers/catalogController.js';

const router = Router();

router.get('/', listBrands);

export default router;
