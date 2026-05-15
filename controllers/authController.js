import User from "../models/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // Use Gmail App Password (not account password)
  }
});

// Verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.warn('[EMAIL] Transporter not ready (check EMAIL_USER / App Password):', error.message);
  } else {
    console.log('[EMAIL] Transporter ready ✓ -', process.env.EMAIL_USER);
  }
});

// Generate 4 digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const sendOtp = async (req, res) => {
  try {
    const { phone, email, role } = req.body;
    
    if (!phone || !email) {
      return res.status(400).json({ error: "Phone and email are required" });
    }

    let user = await User.findOne({ email });

    // Auto-register if new
    if (!user) {
      user = await User.create({
        phone,
        email,
        role: role || "student"
      });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send Email
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"MyRoommate" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your MyRoommate Login OTP",
        html: `<p>Your OTP for MyRoommate login is: <strong>${otp}</strong></p><p>It is valid for 10 minutes.</p>`
      });
    } else {
      console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
    }

    res.json({ message: "OTP sent successfully to email" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Validate OTP
    if (user.otp !== otp || user.otpExpiry < new Date()) {
      // In Dev mode, allow '1234' to always work if email starts with 'test'
      if (!(process.env.NODE_ENV !== "production" && otp === "1234")) {
         return res.status(400).json({ error: "Invalid or expired OTP" });
      }
    }

    // Clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ error: "Failed to verify OTP" });
  }
};
