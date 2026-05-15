import User from "../models/User.js";
import Lead from "../models/Lead.js";

// @route   GET /api/users/me
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedProperties");
    if (!user) return res.status(404).json({ error: "User not found" });
    
    // Also fetch visit requests based on phone
    const visitRequests = await Lead.find({ phone: user.phone }).populate("listingId", "title images").sort({ createdAt: -1 });

    res.json({
      user,
      visitRequests
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// @route   PUT /api/users/preferences
export const updatePreferences = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id, 
      { preferences: req.body }, 
      { new: true }
    );
    res.json({ message: "Preferences updated", preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ error: "Failed to update preferences" });
  }
};

// @route   POST /api/users/save-property
export const saveProperty = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const user = await User.findById(req.user.id);
    
    if (user.savedProperties.includes(propertyId)) {
      // Remove it
      user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyId);
      await user.save();
      return res.json({ message: "Property removed from saved list", savedProperties: user.savedProperties });
    } else {
      // Add it
      user.savedProperties.push(propertyId);
      await user.save();
      return res.json({ message: "Property saved", savedProperties: user.savedProperties });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to save property" });
  }
};
