import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    propertyType: {
      type: String,
      required: true,
      enum: ["PG", "Boys Hostel", "Girls Hostel", "Flat", "Shared Room", "Private Room", "1BHK", "2BHK", "3BHK"],
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    rent: {
      type: Number,
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    audienceTags: [
      {
        type: String,
        enum: ["boys", "girls", "bachelors", "couples", "students"]
      }
    ],
    amenities: [String],
    images: [String],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    // New fields from UI requirements
    deposit: {
      type: Number,
      default: 0
    },
    brokerage: {
      type: Number,
      default: 0
    },
    maintenance: {
      type: String,
      default: "Included"
    },
    furnished: {
      type: String,
      enum: ["Fully Furnished", "Semi Furnished", "Unfurnished"],
      default: "Fully Furnished"
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    managerInfo: {
      name: String,
      phone: String,
      verified: { type: Boolean, default: true }
    },
    nearbyPlaces: [{
      name: String,
      distance: String,
      time: String
    }],
    rules: [{
      title: String,
      description: String
    }]
  },
  {
    timestamps: true
  }
);

export default mongoose.models.Listing || mongoose.model("Listing", listingSchema);
