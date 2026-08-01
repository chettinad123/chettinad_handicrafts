import express from 'express';
import protect from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';
import customOrderController from '../controller/customOrderController.js';
import upload from '../config/cloudinaryUpload.js';

const router = express.Router();

// Public - website "Custom Order" form hits this
router.post('/create', upload.single('referenceImage'), customOrderController.createCustomOrder);

// Admin only - dashboard list, view, status update, notes, delete
router.get('/getall', protect, authorize('superAdmin', 'admin'), customOrderController.getAllCustomOrders);
router.get('/get/:id', protect, authorize('superAdmin', 'admin'), customOrderController.getCustomOrderById);
router.put('/update/:id/status', protect, authorize('superAdmin', 'admin'), customOrderController.updateStatus);

router.post('/notes/:id', protect, authorize('superAdmin', 'admin'), customOrderController.createAdminNotes);
router.get('/notes/:id', protect, authorize('superAdmin', 'admin'), customOrderController.getAdminNotes);
router.put('/notes/:id', protect, authorize('superAdmin', 'admin'), customOrderController.updateAdminNotes);
router.delete('/notes/:id', protect, authorize('superAdmin', 'admin'), customOrderController.deleteAdminNotes);

router.delete('/delete/:id', protect, authorize('superAdmin', 'admin'), customOrderController.deleteCustomOrder);

export default router;