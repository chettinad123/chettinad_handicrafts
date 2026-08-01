import express from 'express';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import roleController from '../controller/roleController.js';

const router = express.Router();

// Role manage panna superAdmin mattum thaan allow
router.post('/create', protect, authorize('superAdmin'), roleController.createRole);
router.get('/getall', protect, authorize('superAdmin'), roleController.getAllRoles);
router.put('/update/:id/permissions', protect, authorize('superAdmin'), roleController.updateRolePermissions);

export default router;
