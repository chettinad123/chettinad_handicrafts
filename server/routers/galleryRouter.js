import express from 'express';
import galleryController from '../controller/galleryController.js';
import authorize from '../middleware/roleMiddleware.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../config/cloudinaryUpload.js';


const router = express.Router();

router.post(
    '/create',
    protect,
    authorize('superAdmin', 'admin'),
    upload.single('galleryImage'),
    galleryController.createGalleryImage
);

router.get('/get', galleryController.getAllGalleryImages); // public - gallery display ku
router.delete('/delete/:id', protect, authorize('superAdmin', 'admin'), galleryController.deleteGalleryImage);
router.get('/getall', protect, authorize('superAdmin', 'admin'), galleryController.getAllGalleryImages);

router.get('/get/id/:id', protect, authorize('superAdmin', 'admin'), galleryController.getGalleryImageById);

router.put(
    '/update/:id',
    protect,
    authorize('superAdmin', 'admin'),
    upload.single('galleryImage'),
    galleryController.updateGalleryImage
);

router.delete('/delete/:id', protect, authorize('superAdmin', 'admin'), galleryController.deleteGalleryImage);

// Public - SEO friendly slug URL, idha ella routes kum keela mattum vekkanum
router.get('/slug/:slug', galleryController.getGalleryImageBySlug);

export default router;