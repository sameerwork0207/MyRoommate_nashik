import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false  // Optional for OTP-based auth
  },
  phone: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ["student", "owner", "admin"],
    default: "student"
  },
  otp: String,
  otpExpiry: Date,
  savedProperties: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  }],
  preferences: {
    budgetMin: Number,
    budgetMax: Number,
    food: String,
    sleep: String,
    smoking: String
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
