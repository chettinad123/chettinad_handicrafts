import express from 'express';
import authRouter from './authRouter.js';
import blogRouter from "./blogRouter.js";
import roleRouter from "./roleRouter.js";
import categoryRouter from "./categoryRouter.js";
import galleryRouter from "./galleryRouter.js";
import customOrderRouter from './customOrderRouter.js';
import contactRouter from "./contactRouter.js";
import enquiryRouter from "./enquiryRouter.js"

const router = express.Router();

// Auth routes -> /api/auth/register, /api/auth/login
router.use('/auth', authRouter);
router.use("/blogs",blogRouter);
router.use("/contacts",contactRouter);
router.use("/enquiry",enquiryRouter)

// Role routes -> /api/role (superAdmin only, dynamic permissions)
router.use('/role', roleRouter);
router.use('/category', categoryRouter);
router.use('/gallery', galleryRouter);
router.use('/custom-order', customOrderRouter);

export default router;
