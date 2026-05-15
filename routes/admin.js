import express from "express";
import { 
  getAdminStats, 
  getProperties, 
  createProperty, 
  updateProperty, 
  getLeads, 
  updateLeadStatus 
} from "../controllers/adminController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// All routes require admin auth
router.use(protect);
router.use(authorize("admin"));

router.get("/stats", getAdminStats);
router.route("/properties")
  .get(getProperties)
  .post(createProperty);
router.put("/properties/:id", updateProperty);

router.route("/leads")
  .get(getLeads);
router.put("/leads/:id", updateLeadStatus);

export default router;
