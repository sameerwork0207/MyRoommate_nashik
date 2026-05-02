import Lead from "../models/Lead.js";
import mongoose from "mongoose";

const allowedStatuses = ["New", "Contacted", "Visit Scheduled", "Converted", "Dropped"];

export const createLead = async (req, res) => {
  try {
    const { name, phone, listingId, status } = req.body;

    if (!name || !phone || !listingId) {
      return res.status(400).json({
        error: "name, phone, and listingId are required"
      });
    }

    const lead = await Lead.create({
      name,
      phone,
      listingId,
      status
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("listingId")
      .sort({ createdAt: -1 });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLeadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        error: "status is required"
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: `status must be one of: ${allowedStatuses.join(", ")}`
      });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("listingId");

    if (!updatedLead) {
      return res.status(404).json({
        error: "Lead not found"
      });
    }

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid lead id"
      });
    }

    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({
        error: "Lead not found"
      });
    }

    res.json({
      message: "Lead deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
