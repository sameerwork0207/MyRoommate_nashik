import mongoose from "mongoose";
import Listing from "../models/Listing.js";

export const createListing = async (req, res) => {
  try {
    const { title, rent, location, amenities, images, status, ownerId } = req.body;

    if (!title || rent === undefined || !location) {
      return res.status(400).json({
        error: "title, rent, and location are required"
      });
    }

    const listing = await Listing.create({
      title,
      rent,
      location,
      amenities: amenities || [],
      images: images || [],
      status,
      ownerId
    });

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getListings = async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid listing id"
      });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid listing id"
      });
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updatedListing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    res.json(updatedListing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid listing id"
      });
    }

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({
        error: "Listing not found"
      });
    }

    res.json({
      message: "Listing deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
