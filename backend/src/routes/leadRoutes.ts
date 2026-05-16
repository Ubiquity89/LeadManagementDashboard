import express from "express";

import {
  createLead,
  deleteLead,
  getLeads,
  getSingleLead,
  updateLead,
} from "../controllers/leadController";

import { protect } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
const router = express.Router();

router.post("/", protect, createLead);

router.get("/", protect, getLeads);

router.get("/:id", protect, getSingleLead);

router.put("/:id", protect, updateLead);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteLead
);

export default router;