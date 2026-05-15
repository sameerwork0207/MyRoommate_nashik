import express from "express";
import { 
  getProfile, 
  updatePreferences, 
  saveProperty 
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("student"));

router.get("/me", getProfile);
router.put("/preferences", updatePreferences);
router.post("/save-property", saveProperty);

export default router;
