import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { Router } from 'express';
import multer from 'multer';

import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { createHttpError } from '../utils/httpError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads/products');

fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const safeName = path
      .basename(file.originalname, extension)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();

    callback(null, `${Date.now()}-${safeName || 'producto'}${extension}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith('image/')) {
      return callback(createHttpError(422, 'El archivo debe ser una imagen.'));
    }

    return callback(null, true);
  },
});

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.post('/product-image', upload.single('image'), (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(422, 'Debes seleccionar una imagen.');
    }

    res.status(201).json({
      filename: req.file.filename,
      url: `/uploads/products/${req.file.filename}`,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
