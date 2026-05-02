import express from "express";
import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  updateListing
} from "../controllers/listingController.js";

const router = express.Router();

router.post("/", createListing);
router.get("/", getListings);
router.get("/:id", getListingById);
router.patch("/:id", updateListing);
router.delete("/:id", deleteListing);

export default router;
