import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Visit Scheduled", "Converted", "Dropped"],
      default: "New"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Lead", leadSchema);
