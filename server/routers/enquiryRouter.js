import { Router } from "express";
import enquiryController from "../controller/enquiryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = Router();

// Public
router.post("/create", enquiryController.create);

// Admin
router.get(
  "/getall",
  authMiddleware,
  allowRoles("superAdmin"),
  enquiryController.getAll
);

router.get(
  "/get/:id",
  authMiddleware,
  allowRoles("superAdmin"),
  enquiryController.getById
);

router.delete(
  "/delete/:id",
  authMiddleware,
  allowRoles("superAdmin"),
  enquiryController.remove
);

router.put(
  "/update/:id/status",
  authMiddleware,
  allowRoles("superAdmin"),
  enquiryController.updateStatus
);

export default router;