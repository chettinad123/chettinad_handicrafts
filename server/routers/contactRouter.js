import { Router } from "express";
import contactController from "../controller/contactController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = Router();

// Public Contact Form
router.post("/create", contactController.create);

// Admin Routes
router.get(
  "/getall",
  authMiddleware,
  allowRoles("superAdmin"),
  contactController.getAll
);

router.get(
  "/get/:id",
  authMiddleware,
  allowRoles("superAdmin"),
  contactController.getById
);

router.delete(
  "/delete/:id",
  authMiddleware,
  allowRoles("superAdmin"),
  contactController.remove
);

router.put(
  "/update/:id/status",
  authMiddleware,
  allowRoles("superAdmin"),
  contactController.updateStatus
);

export default router;