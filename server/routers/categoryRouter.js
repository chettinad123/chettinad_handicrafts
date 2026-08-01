import express from 'express';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import categoryController from '../controller/categoryController.js';

const router = express.Router();

router.post('/create', protect, authorize('superAdmin', 'admin'), categoryController.createCategory);
router.get('/getall', categoryController.getAllCategories); // public - dropdown ku list venum

export default router;