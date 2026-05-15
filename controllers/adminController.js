import Listing from "../models/Listing.js";
import Lead from "../models/Lead.js";

// @route   GET /api/admin/stats
export const getAdminStats = async (req, res) => {
  try {
    const totalProperties = await Listing.countDocuments();
    const activeLeads = await Lead.countDocuments({ status: { $in: ["New", "Contacted", "Visit Scheduled"] } });
    const premiumListings = await Listing.countDocuments({ isPremium: true });
    const visitRequests = await Lead.countDocuments({ status: "Visit Scheduled" });

    res.json({
      totalProperties,
      activeLeads,
      premiumListings,
      visitRequests,
      monthlyVisitors: "3.2k", // Mock
      whatsappInquiries: "112" // Mock
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// @route   GET /api/admin/properties
export const getProperties = async (req, res) => {
  try {
    const properties = await Listing.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// @route   POST /api/admin/properties
export const createProperty = async (req, res) => {
  try {
    const property = await Listing.create(req.body);
    res.status(201).json({ message: "Property added successfully", property });
  } catch (error) {
    res.status(500).json({ error: "Failed to create property" });
  }
};

// @route   PUT /api/admin/properties/:id
export const updateProperty = async (req, res) => {
  try {
    const property = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) return res.status(404).json({ error: "Property not found" });
    res.json({ message: "Property updated successfully", property });
  } catch (error) {
    res.status(500).json({ error: "Failed to update property" });
  }
};

// @route   GET /api/admin/leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate("listingId", "title isPremium").sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
};

// @route   PUT /api/admin/leads/:id
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const lead = await Lead.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ message: "Lead status updated", lead });
  } catch (error) {
    res.status(500).json({ error: "Failed to update lead status" });
  }
};
