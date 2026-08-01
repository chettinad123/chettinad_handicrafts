import { Router } from "express";

import blogController from "../controller/blogController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";
import upload from "../config/cloudinaryUpload.js";

const router = Router();

router.post(
  "/create",
  authMiddleware,
  allowRoles("superAdmin", "user"),
  upload.fields([
    {
      name: "heroImage",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 20,
    },
  ]),
  blogController.create
);

router.get("/getall", blogController.getAll);

router.get("/get/:id", blogController.getById);

router.put(
  "/update/:id",
  authMiddleware,
  upload.fields([
    {
      name: "heroImage",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 20,
    },
  ]),
  blogController.update
);

router.delete(
  "/delete/:id",
  authMiddleware,
  blogController.remove
);

export default router;